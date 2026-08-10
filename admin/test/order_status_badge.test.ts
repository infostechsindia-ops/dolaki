import assert from "node:assert";
import { test, describe } from "node:test";
import { getStatusToken } from "../src/components/OrderStatusBadge";

describe("GAP-P2-04 Admin Order Status Badge Design System Tests", () => {
  test("1. Standard order status mapping maps known machine statuses to valid design system tokens", () => {
    const pendingToken = getStatusToken("PENDING");
    const processingToken = getStatusToken("PROCESSING");
    const confirmedToken = getStatusToken("CONFIRMED");

    assert.strictEqual(pendingToken.variant, "warning");
    assert.strictEqual(processingToken.variant, "warning");
    assert.strictEqual(confirmedToken.variant, "warning");
    assert.strictEqual(pendingToken.label, "Pending");
  });

  test("2. Delivered status maps to success token with green badge palette", () => {
    const tokenUpper = getStatusToken("DELIVERED");
    const tokenTitle = getStatusToken("Delivered");

    assert.strictEqual(tokenUpper.variant, "success");
    assert.strictEqual(tokenTitle.variant, "success");
    assert.strictEqual(tokenUpper.backgroundColor, "#ECFDF5");
    assert.strictEqual(tokenUpper.textColor, "#047857");
    assert.strictEqual(tokenUpper.label, "Delivered");
  });

  test("3. Cancelled status maps to danger token with red badge palette", () => {
    const tokenUpper = getStatusToken("CANCELLED");
    const tokenTitle = getStatusToken("Cancelled");

    assert.strictEqual(tokenUpper.variant, "danger");
    assert.strictEqual(tokenTitle.variant, "danger");
    assert.strictEqual(tokenUpper.backgroundColor, "#FEF2F2");
    assert.strictEqual(tokenUpper.textColor, "#B91C1C");
    assert.strictEqual(tokenUpper.label, "Cancelled");
  });

  test("4. Out-for-delivery and Shipped statuses map to info token with blue badge palette", () => {
    const outForDeliveryToken = getStatusToken("OUT_FOR_DELIVERY");
    const shippedToken = getStatusToken("SHIPPED");

    assert.strictEqual(outForDeliveryToken.variant, "info");
    assert.strictEqual(shippedToken.variant, "info");
    assert.strictEqual(outForDeliveryToken.label, "Out for Delivery");
    assert.strictEqual(shippedToken.label, "Shipped");
  });

  test("5. Return and refund statuses map to standardized purple/red design system tokens", () => {
    const returnRequestedToken = getStatusToken("RETURN_REQUESTED");
    const returnedToken = getStatusToken("RETURNED");
    const refundedToken = getStatusToken("REFUNDED");
    const partiallyRefundedToken = getStatusToken("PARTIALLY_REFUNDED");

    assert.strictEqual(returnRequestedToken.label, "Return Requested");
    assert.strictEqual(returnedToken.label, "Returned");
    assert.strictEqual(refundedToken.label, "Refunded");
    assert.strictEqual(partiallyRefundedToken.label, "Partially Refunded");

    assert.strictEqual(partiallyRefundedToken.backgroundColor, "#FFE4E6");
    assert.strictEqual(partiallyRefundedToken.textColor, "#9F1239");
  });

  test("6. Machine status labels are converted to human-readable title-cased labels", () => {
    assert.strictEqual(getStatusToken("OUT_FOR_DELIVERY").label, "Out for Delivery");
    assert.strictEqual(getStatusToken("READY_FOR_PICKUP").label, "Ready for Pickup");
    assert.strictEqual(getStatusToken("RETURN_REQUESTED").label, "Return Requested");
    assert.strictEqual(getStatusToken("PARTIALLY_REFUNDED").label, "Partially Refunded");
  });

  test("7. Unknown status fallback safely handles future/unrecognized backend statuses without crashing", () => {
    const unknownToken = getStatusToken("DISPATCH_IN_PROGRESS");
    const emptyToken = getStatusToken("");

    assert.strictEqual(unknownToken.variant, "neutral");
    assert.strictEqual(unknownToken.label, "Dispatch In Progress");
    assert.strictEqual(unknownToken.backgroundColor, "#F3F4F6");

    assert.strictEqual(emptyToken.variant, "neutral");
    assert.strictEqual(emptyToken.label, "Unknown");
  });

  test("8. Same status maps to exact same design token everywhere across Admin platform", () => {
    const tokenA = getStatusToken("DELIVERED");
    const tokenB = getStatusToken("DELIVERED");

    assert.deepStrictEqual(tokenA, tokenB);
  });

  test("9. Badge token includes readable label string independent of visual color coding for accessibility", () => {
    const token = getStatusToken("CANCELLED");
    assert.ok(typeof token.label === "string" && token.label.length > 0);
    assert.strictEqual(token.label, "Cancelled");
  });

  test("10. Centralized badge mapping exports consistent STATUS_TOKEN_MAP", () => {
    const statuses = ["DELIVERED", "SHIPPED", "PROCESSING", "PENDING", "CANCELLED", "RETURNED", "REFUNDED"];
    statuses.forEach((status) => {
      const token = getStatusToken(status);
      assert.ok(token.label);
      assert.ok(token.backgroundColor);
      assert.ok(token.textColor);
    });
  });
});
