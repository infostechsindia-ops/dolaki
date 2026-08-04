import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, Payment, UserWallet, Inventory, ReturnRequest, LoyaltyTransaction } from '../database/entities';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(UserWallet)
    private readonly walletRepository: Repository<UserWallet>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(ReturnRequest)
    private readonly returnRepository: Repository<ReturnRequest>,
    @InjectRepository(LoyaltyTransaction)
    private readonly loyaltyRepository: Repository<LoyaltyTransaction>,
  ) {}

  async findAll(user: any): Promise<Order[]> {
    if (user.role === 'ADMIN') {
      return this.orderRepository.find({ order: { createdAt: 'DESC' } });
    } else if (user.role === 'CUSTOMER') {
      return this.orderRepository.find({ where: { customerId: user.userId }, order: { createdAt: 'DESC' } });
    } else if (user.role === 'VENDOR') {
      // Find orders that contain items belonging to this vendor
      const items = await this.orderItemRepository.find({ where: { vendorId: user.userId } });
      const orderIds = [...new Set(items.map(item => item.orderId))];
      if (orderIds.length === 0) return [];
      return this.orderRepository.createQueryBuilder('order')
        .where('order.id IN (:...orderIds)', { orderIds })
        .orderBy('order.createdAt', 'DESC')
        .getMany();
    }
    return [];
  }

  async findOne(id: string, user: any): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'CUSTOMER' && order.customerId !== user.userId) {
      throw new BadRequestException('Unauthorized to view this order');
    }

    const items = await this.orderItemRepository.find({ where: { orderId: id } });
    return {
      ...order,
      items,
    };
  }

  async create(user: any, data: any): Promise<Order> {
    const { items, totalAmount, discountAmount, shippingAddress, billingAddress, paymentMethod, isQuickCommerce } = data;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain items');
    }

    // Double check wallet balance if payment is wallet
    if (paymentMethod === 'Aura Wallet' || paymentMethod === 'Aura Pay') {
      const wallet = await this.walletRepository.findOne({ where: { userId: user.userId } });
      if (!wallet || wallet.balance < totalAmount) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      // Deduct wallet balance
      wallet.balance -= totalAmount;
      await this.walletRepository.save(wallet);
    } else if (paymentMethod === 'AuraCoins' || data.burnPoints > 0) {
      const burnPoints = data.burnPoints || (totalAmount * 10);
      const wallet = await this.walletRepository.findOne({ where: { userId: user.userId } });
      if (!wallet || wallet.rewardPoints < burnPoints) {
        throw new BadRequestException('Insufficient reward points');
      }
      wallet.rewardPoints -= burnPoints;
      await this.walletRepository.save(wallet);

      const burnTx = this.loyaltyRepository.create({
        userId: user.userId,
        type: 'BURN',
        points: -burnPoints,
        monetaryValue: burnPoints / 10,
        description: 'Burned at checkout',
      });
      await this.loyaltyRepository.save(burnTx);
    }

    // Save main order details
    const order = this.orderRepository.create({
      customerId: user.userId,
      totalAmount,
      discountAmount: discountAmount || 0,
      status: 'PLACED',
      shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
      billingAddress: typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress),
      paymentMethod,
      deliveryMinutes: isQuickCommerce ? 12 : 35,
      verificationOtp: Math.floor(1000 + Math.random() * 9000).toString(),
    });

    const savedOrder = await this.orderRepository.save(order);

    // Save order items & decrement inventories
    const summaryList = [];
    for (const item of items) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        vendorId: item.vendorId || 'flagship-store-id',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
        status: 'PLACED',
      });
      await this.orderItemRepository.save(orderItem);

      summaryList.push(`${item.title || 'Product'} x ${item.quantity}`);

      // Try decrementing inventory
      const inv = await this.inventoryRepository.findOne({ where: { productId: item.productId } });
      if (inv) {
        inv.stockQuantity = Math.max(0, inv.stockQuantity - item.quantity);
        await this.inventoryRepository.save(inv);
      }
    }

    savedOrder.itemsSummary = summaryList.join(', ');
    await this.orderRepository.save(savedOrder);

    // Calculate reward points: Math.floor(totalAmount * 0.01)
    const earnedPoints = Math.floor(totalAmount * 0.01);
    if (earnedPoints > 0) {
      const wallet = await this.walletRepository.findOne({ where: { userId: user.userId } });
      if (wallet) {
        wallet.rewardPoints += earnedPoints;
        await this.walletRepository.save(wallet);

        const earnTx = this.loyaltyRepository.create({
          userId: user.userId,
          type: 'EARN',
          points: earnedPoints,
          monetaryValue: earnedPoints / 10,
          orderId: savedOrder.id,
          description: 'Order reward',
        });
        await this.loyaltyRepository.save(earnTx);
      }
    }

    // Save payment details
    const payment = this.paymentRepository.create({
      orderId: savedOrder.id,
      customerId: user.userId,
      amount: totalAmount,
      method: paymentMethod,
      status: (paymentMethod === 'Aura Wallet' || paymentMethod === 'Aura Pay') ? 'CAPTURED' : 'PENDING',
      transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
    });
    await this.paymentRepository.save(payment);

    return savedOrder;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status as any;
    const updated = await this.orderRepository.save(order);

    // Sync individual items statuses
    await this.orderItemRepository.update({ orderId: id }, { status: status as any });

    return updated;
  }

  async createReturn(orderId: string, customerId: string, data: any) {
    const ret = this.returnRepository.create({
      orderId,
      customerId,
      reason: data.reason,
      description: data.description,
      status: 'REQUESTED',
    });
    return this.returnRepository.save(ret);
  }

  async getReturnStatus(orderId: string) {
    const ret = await this.returnRepository.findOne({ where: { orderId } });
    if (!ret) throw new NotFoundException('Return request not found');
    return ret;
  }

  async approveReturn(returnId: string, refundAmount: number) {
    const ret = await this.returnRepository.findOne({ where: { id: returnId } });
    if (!ret) throw new NotFoundException('Return request not found');
    ret.status = 'APPROVED';
    ret.refundAmount = refundAmount;
    await this.returnRepository.save(ret);

    await this.updateStatus(ret.orderId, 'RETURNED');
    return ret;
  }

  async rejectReturn(returnId: string) {
    const ret = await this.returnRepository.findOne({ where: { id: returnId } });
    if (!ret) throw new NotFoundException('Return request not found');
    ret.status = 'REJECTED';
    return this.returnRepository.save(ret);
  }
}

