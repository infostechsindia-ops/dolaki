# MERCHANDISING_CMS_EXTENSION.md

## Dynamic Storefront, Advertising & Merchandising Layer

This extension is mandatory for Customer Web and Customer Mobile. It
extends `COMMERCE_OS.md`.

## A. CORE PRINCIPLE

Do not hard-code the commercial storefront as a fixed list of React
components. Build a versioned, typed, admin-managed **Merchandising Page
Composer**. Catalog truth (product, price, stock, seller,
serviceability) stays in commerce/search services; CMS controls
presentation, targeting, placement and curation.

The system must support page-level composition for: - Marketplace Home -
Quick-commerce Home - Category landing - Subcategory landing - Brand
directory - Brand landing/store - New Launches - Deals/Offers -
Campaign/Event landing - Search merchandising - PLP merchandising
slots - PDP merchandising slots - Cart promotional slots -
Account/loyalty promotional slots - Mobile-only discovery pages

## B. ADMIN-MANAGED BLOCK REGISTRY

Implement a schema-versioned block registry. Initial block types: 1.
AnnouncementStrip 2. ServiceabilityStrip 3. PromoTicker 4. HeroCarousel
5. HeroVideo 6. IconMenu 7. CategoryCircleGrid 8. CategoryCardGrid 9.
SubcategoryChips 10. QuickCommerceEntry 11. ImageBannerFull 12.
ImageBannerSplit 13. ImageBannerGrid 14. AdStrip 15. SponsoredBanner 16.
SponsoredProductRow 17. ProductCarousel 18. ProductGrid 19. FlashDeals
20. DealCountdown 21. BrandLogoCarousel 22. BrandGrid 23. BrandSpotlight
24. BrandStoryBanner 25. NewLaunchStrip 26. NewLaunchCarousel 27.
NewLaunchHero 28. TrendingNow 29. BestSellers 30. RecommendedForYou 31.
RecentlyViewed 32. ContinueShopping 33. BuyAgain 34.
PricePointCollection 35. CouponStrip 36. BankOfferStrip 37.
PaymentOfferStrip 38. LoyaltyStrip 39. ReferralStrip 40. MembershipStrip
41. EditorialCollection 42. ShopTheLook 43. Video/ReelCarousel 44.
BenefitTrustStrip 45. DeliveryPromiseStrip 46. SeasonalCampaign 47.
StoreCarousel 48. QuickCategoryShelf 49. QuickReorderShelf 50.
RichTextSEO 51. Spacer/Divider (controlled) 52. AppDownloadStrip (web
only) 53. StickyPromoBar (policy controlled) 54. FloatingCampaignEntry
(policy controlled)

Each block schema defines supported platforms, aspect ratios, content
fields, CTA/deep-link type, product source, targeting, analytics and
accessibility requirements.

## C. PAGE COMPOSER DATA MODEL

Create entities/tables conceptually equivalent to: - PageDefinition -
PageVersion - PagePlacement - ContentBlock - ContentBlockVersion -
Campaign - Creative - Audience - PlacementRule - Schedule - Experiment -
Sponsorship - MerchandisingCollection

Every placement needs: - stable placement ID - page/route scope - block
type + schema version - position/order - enabled status - web/mobile
visibility - marketplace/Quick channel - country/city/zone/store
targeting - logged-in/guest targeting - optional audience segment -
start/end schedule + timezone - priority - fallback behavior - frequency
cap where applicable - experiment assignment - analytics identifiers -
draft/published state

## D. ADMIN PAGE BUILDER

Build a professional page composer: - left: block library - center: page
structure/preview - right: selected block properties - drag-and-drop
ordering - move up/down keyboard-accessible controls - duplicate -
enable/disable - schedule - web/mobile visibility - device preview -
target audience/location - product/brand/category collection picker -
image/creative picker - CTA/deep-link builder - draft - preview -
publish - scheduled publish - rollback/version history - clone
page/campaign - validation before publish - unsaved-change protection -
audit log

Never allow admin to paste arbitrary executable JS.

## E. MERCHANDISING SOURCES

Product blocks can source from: - manually curated SKU collection -
category - brand - campaign - best sellers - trending - new arrivals -
recently viewed - personalized recommendation - price range - highest
discount - Quick serviceable inventory - store assortment -
search/ranking rule

Admin controls merchandising intent; backend resolves current eligible
products so stale/out-of-stock products are not blindly displayed.

## F. POSITION & PRIORITY ENGINE

Render placements by: 1. route/page eligibility 2. channel/platform 3.
location/serviceability 4. schedule 5. audience/experiment 6. campaign
priority 7. explicit position/order 8. safe fallback

Conflicting campaigns must resolve deterministically. Preview must
explain why a block will/will not render for a simulated user context.

## G. BRAND EXPERIENCE

Create `/brands`: - featured brands hero - A--Z directory - search
brands - popular brands - trending brands - category-specific brands -
premium/official stores if business supports them - promotional
banners/strips - new brand launches

Create `/brand/[slug]`: - brand hero/identity - follow/favorite
optional - brand categories - current campaigns - new launches - best
sellers - curated collections - product PLP - editorial/story modules -
sponsored/promotional slots with disclosure where required - SEO content

Admin controls brand assets, featured status, campaigns and page blocks;
catalog/search remains product truth.

## H. NEW LAUNCH EXPERIENCE

Create `/new-launches`: - launch hero - launch calendar/coming soon if
real data exists - just launched - category launch shelves - brand
launch shelves - exclusive launches - pre-order/register-interest only
if business workflow supports it - launch promo strips - launch detail
landing pages - notify-me with consent - analytics for launch
impression, interest, PDP and conversion

Never label old inventory "new" without a defined launch/newness policy.

## I. CATEGORY MERCHANDISING

Category pages support placements: - above title - below title - after
subcategories - before product grid - after configurable product row N -
between pagination/infinite chunks where UX permits - below product
results

Possible category blocks: hero, icon subcategories, promo strip, brand
shelf, new launches, deal shelf, editorial collection, sponsored
banner/product shelf, coupon/payment offer, recommendations.

Ads must not destroy filter/sort usability or make organic products
visually deceptive.

## J. MOBILE HOME COMPOSITION

Mobile has its own layout config while sharing content/campaign objects
where possible. Recommended eligible sequence: - location + delivery
promise - search - compact promo/service strip - marketplace/Quick
switch or Quick entry - hero carousel - icon shortcuts - category grid -
campaign/ad strip - deals - new launches - brand logos - personalized
shelf - price collections - trending - sponsored/brand spotlight - buy
again - recently viewed - editorial/video - loyalty/referral - trust
strip

Admin can reorder blocks; renderer enforces UX safety rules
(e.g. maximum consecutive ad blocks, hero limits, minimum content
diversity).

## K. QUICK-COMMERCE COMPOSITION

Quick home/category only renders serviceable inventory/content.
Support: - ETA/serviceability header - search - Quick category icons -
campaign hero - offer strip - essentials/reorder - category shelves -
brand shelf - sponsored shelf - price/value shelf - meal/snack/occasion
collections - late-night/breakfast/etc only when scheduled and
relevant - store-specific campaigns - inventory-safe recommendations

## L. ADVERTISING / RETAIL MEDIA

Build retail-media-ready placements without mixing advertising truth
into catalog: - sponsored banner - sponsored product - sponsored brand
shelf - search sponsored slots - category sponsored slots - campaign
sponsorship

Every paid placement has sponsor/campaign metadata, disclosure
capability, impression/click/conversion events, schedule, budget
integration point, targeting and frequency cap. Organic ranking remains
distinguishable from sponsored ranking.

## M. DEEP LINK SYSTEM

Create one validated link resolver supporting: - product - category -
brand - search query - campaign - collection - Quick page/store -
deals - new launches - coupon - external URL only through allowlisted
policy

Same campaign should navigate correctly on web and mobile.

## N. CREATIVE ASSET SYSTEM

Admin media library: - desktop/mobile image variants - aspect-ratio
presets - alt text - file size/dimension validation -
compression/optimization pipeline - focal point - scheduled asset -
usage references - replace asset without breaking history - no duplicate
uncontrolled uploads

## O. ANALYTICS

Every block sends: - page_view context - placement_impression -
creative_impression - product_impression - placement_click -
product_click - campaign ID - placement ID - block ID/version -
position - channel - experiment - downstream add-to-cart/purchase
attribution according to documented attribution policy

Do not count an impression merely because data was fetched; define
viewport visibility.

## P. STORE-FRONT SAFETY RULES

-   Maximum one dominant hero above the fold.
-   Avoid multiple auto-rotating carousels competing simultaneously.
-   No fake countdown, fake viewers, fake stock scarcity.
-   No more than a configured number of consecutive commercial/ad
    blocks.
-   Ads/sponsored content must be distinguishable.
-   Critical search/filter/cart actions cannot be displaced by
    campaigns.
-   Page composer cannot inject unsafe HTML/JS.
-   Invalid block schema cannot publish.
-   Expired campaigns automatically stop rendering.
-   Empty product sources collapse cleanly.
-   Out-of-stock/serviceability filters apply at render-resolution time.
-   Renderer supports unknown future block schema gracefully.
-   CMS outage uses cached last-known-good published page, not an empty
    storefront.

# EXECUTION COMMANDS

## MCH-001 --- CMS audit

Audit current SDUI/CMS, home blocks, campaigns, category pages, brand
handling and mobile renderers. Create `docs/MERCHANDISING_GAP.md`
comparing current capabilities with this extension. Do not implement
yet.

## MCH-002 --- Page composer schema

Design and implement versioned
PageDefinition/PageVersion/Placement/Block schemas and migrations
compatible with existing CMS data. Preserve current published home
behavior during migration.

## MCH-003 --- Block registry

Implement the typed block registry listed in Section B. Each block
declares schema, supported surfaces, required assets, allowed data
sources and renderer capability version.

## MCH-004 --- Admin composer

Implement drag/drop + move controls, block library, properties panel,
ordering, visibility, duplication, scheduling, targeting,
draft/preview/publish and validation.

## MCH-005 --- Versioning & rollback

Implement immutable published versions, draft editing, scheduled
publishing, rollback and complete audit history.

## MCH-006 --- Targeting engine

Implement platform, channel, country/city/zone/store, auth state,
audience, schedule and experiment eligibility with deterministic
priority.

## MCH-007 --- Product source resolver

Implement real-time collection resolution for manual, category, brand,
deals, new, trending, bestseller, recommendation, price and Quick
inventory sources. Filter invalid/ineligible products.

## MCH-008 --- Web renderer

Refactor customer web pages to render supported CMS blocks through a
safe registry while retaining SSR/cache/performance requirements and
graceful unknown-block handling.

## MCH-009 --- Mobile renderer

Implement equivalent native React Native block registry. Reuse content
contracts but allow platform-specific presentation. Unsupported blocks
fail closed without crashing the page.

## MCH-010 --- Home merchandising

Migrate marketplace home to composer including strips, icons, heroes,
categories, ads, promos, deals, launches, brands, recommendations, price
collections and retention modules.

## MCH-011 --- Quick home merchandising

Migrate Quick home to location/serviceability-aware composer. Never show
non-serviceable store assortment as instantly available.

## MCH-012 --- Category placements

Add category page placement zones and admin configuration for hero,
strips, icons, brands, launch/deal shelves and sponsored modules around
the PLP without breaking filter/sort usability.

## MCH-013 --- Brand directory

Build `/brands` with search, A--Z, featured/trending/category brand
modules and CMS promotional placements. Add admin brand merchandising
controls.

## MCH-014 --- Brand landing

Build brand landing/store template with hero, categories, offers, new
launches, best sellers, curated blocks, PLP and editorial/SEO modules.

## MCH-015 --- New launches

Build `/new-launches`, launch collections and optional launch-detail
template. Define server-side newness/launch policy and admin launch
scheduling.

## MCH-016 --- Deals hub

Build `/deals` as a merchandised destination with campaign hero,
limited-time real deals, category/brand deal shelves, coupons/payment
promos and filterable deal PLP.

## MCH-017 --- Campaign landing

Build reusable `/campaign/[slug]` page composed entirely from validated
blocks with draft preview, schedule, audience/location and analytics.

## MCH-018 --- PLP insertion

Implement configurable merchandising insertion points in search/category
PLPs. Maintain stable product indexing, pagination, accessibility and
sponsored disclosure.

## MCH-019 --- PDP merchandising

Implement controlled placements for brand story, bundles, offers,
related, sponsored recommendations and recently viewed without pushing
purchase information below unnecessary ads.

## MCH-020 --- Cart merchandising

Add conservative cart placements for valid
coupon/payment/threshold/cross-sell modules. Never distract from
checkout or alter totals client-side.

## MCH-021 --- Retail media

Implement sponsored placement metadata, disclosure, tracking, targeting
and budget/provider integration interfaces. Keep sponsored and organic
ranking logically separate.

## MCH-022 --- Creative library

Build media library with desktop/mobile variants, validation,
optimization metadata, alt text, focal point and usage tracking.

## MCH-023 --- Deep links

Build validated cross-platform deep-link contract and resolver for
product/category/brand/search/campaign/collection/Quick/deals/new-launch
pages.

## MCH-024 --- Preview simulator

Admin preview can simulate web/mobile, guest/member, marketplace/Quick
and supported location/store context and explain placement eligibility.

## MCH-025 --- Merchandising analytics

Implement viewport-based impressions, clicks and attribution identifiers
for every placement/block/creative/product source. Document event
definitions.

## MCH-026 --- Merchandising guardrails

Implement renderer/admin constraints: hero count, consecutive-ad cap,
invalid schema prevention, campaign expiry, empty-source collapse, safe
HTML policy and last-known-good published fallback.

## MCH-027 --- Performance

Measure composer overhead. Batch/resolver APIs to avoid one request per
block, cache safely, lazy-load below fold, optimize creatives and
prevent layout shifts.

## MCH-028 --- Final parity

Verify Home, Quick Home, Category, Brand, New Launch, Deals and Campaign
pages across customer web + canonical mobile. Create matrix of supported
block types and fix unexplained parity gaps.

# ANTIGRAVITY EXECUTION WRAPPER

Execute **\[MCH COMMAND\]** only. First read `COMMERCE_OS.md`, this
merchandising extension, existing CMS/SDUI implementation and all
consumers. Inspect before editing. Preserve existing working commerce
behavior. Catalog/price/inventory truth stays outside CMS. Do not
hard-code storefront sections that should be placements. Do not
introduce fake urgency or sponsored content without disclosure
capability. Implement the smallest complete change, update all affected
typed contracts/renderers, test web/mobile/admin where affected,
document migration and stop after this command.
