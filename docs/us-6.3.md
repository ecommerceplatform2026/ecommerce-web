# US 6.3 — Redeem Points During Checkout (ABC-248)

## What

Allow users to redeem available loyalty points at checkout for a VND discount. Input with validation, real-time discount preview, and adjusted total. 1 point = 100 VND discount, minimum 100 points per redemption.

## Backend API

### POST /api/checkout

**Request:**
```json
{
    "paymentMethod": 0,
    "redeemedPoints": 500
}
```

**Response (with redemption):**
```json
{
    "isSuccess": true,
    "message": null,
    "data": {
        "orderId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "orderCode": 12345,
        "totalAmount": 500000,
        "discountAmount": 50000,
        "paidAmount": 450000,
        "status": 0,
        "paymentMethod": 0,
        "items": [...],
        "checkoutUrl": null,
        "paymentLinkId": null
    }
}
```

| Field | Source |
|---|---|
| `discountAmount` | `redeemedPoints × 100` (1 pt = 100 VND) |
| `paidAmount` | `totalAmount - discountAmount` |

### Backend Validation (in `LoyaltyService`)

The backend validates:
- Points must be in multiples of 100 (`PointPerRedeemUnit`)
- Must not exceed `account.AvailablePoints`
- If validation fails, returns error: `"Insufficient points. You have X points but attempted to redeem Y."` or `"Redeemed points must be in multiples of 100."`

### GET /api/loyalty/balance

Used to check current balance before redemption. Same response as US 6.1.

| Field | Value | Note |
|---|---|---|
| `balance` | 30000 | **This is AVAILABLE + PENDING combined** |
| `discountEquivalent` | 3000000 | `balance × 100` |

**⚠️ Caveat:** The current balance endpoint returns `balance = availablePoints + pendingPoints`. The checkout form needs to show available balance only. If the backend cannot be modified, the frontend should use the previous available balance (before the current order) tracked client-side, or the backend should be extended to return `availablePoints` separately.

### GET /api/orders/{id}

Order detail response does NOT include `discountAmount`. To show "Points redeemed" on order detail, compute from `discountAmount` stored in the checkout response.

## Points Redemption Rules

| Rule | Value | Backend Const |
|---|---|---|
| Minimum redeem | 100 points | `PointPerRedeemUnit = 100` |
| Multiples of | 100 | Must be `% 100 === 0` |
| Max redeem | `balance` | Checked against `AvailablePoints` |
| Discount rate | 1 pt = 100 VND | `PointRedeemRate = 100` |

## Implementation Steps

### ST 6.3.1 — Points Redemption Input on Checkout Form

**File:** `src/components/checkout/CheckoutForm.tsx`

**Current state:** Already has a basic points input with `usePointsBalance` and discount preview. However:
- Uses wrong balance field (`availablePoints` instead of `balance`)
- Uses wrong discount rate (1,000 VND instead of 100 VND)
- Missing Zod validation (min 100, multiples of 100)

**Changes needed:**

1. **Fix balance source**: The balance API returns `balance` (total), not `availablePoints`. Update the component to use the correct field.

2. **Add Zod validation to the checkout form** (per technical notes in JIRA):

```ts
const pointsSchema = z.object({
    redeemedPoints: z.number()
        .min(100, "Minimum redemption is 100 points")
        .max(balance, "Cannot exceed your available balance")
        .refine(val => val % 100 === 0, "Points must be in multiples of 100")
        .optional()
        .nullable()
})
```

3. **Replace static "Use max" behavior**: Set `pointsToRedeem = Math.floor(balance / 100) * 100` (round down to nearest 100).

4. **Disable input** when balance < 100 or balance is loading/error.

5. **Add error message** for:
   - Balance loading: Skeleton
   - Balance error: "Points unavailable"
   - Insufficient balance (< 100): "You need at least 100 points to redeem"
   - Invalid input (not multiple of 100): "Points must be in multiples of 100"
   - Exceeds balance: "You don't have enough points"

### ST 6.3.2 — Discount Preview Display

**File:** `src/components/checkout/CheckoutForm.tsx` (and possibly `OrderSummary`)

**Current state:** Discount preview exists but uses wrong rate.

**Changes needed:**

1. **Fix discount calculation**: Change from `pointsToRedeem * 1000` to `pointsToRedeem * 100`.

2. **Show adjusted total in OrderSummary**: The `OrderSummary.tsx` component should display the discount and adjusted total when points are redeemed.

```tsx
// In OrderSummary, accept optional discountAmount prop or derive from context
discountAmount = redeemedPoints * 100
adjustedTotal = totalPrice + shipping - discountAmount
```

**Display in OrderSummary:**
```
Items Subtotal                   500,000 VND
Shipping                         30,000 VND
Points Discount              -   50,000 VND  ← green, new line
────────────────────────────────────────────
Total                           480,000 VND
```

3. **Handle edge cases:**
   - Discount > total → `paidAmount` = 0 (backend handles this)
   - No points entered → hide discount line

### States Summary (Checkout Form Points Section)

| State | UI |
|---|---|
| Balance loading | `<Skeleton />` for balance text; input disabled |
| Balance error | "Points unavailable" muted text; input disabled |
| Balance < 100 | Show balance; "Min 100 pts to redeem" message; input disabled |
| Valid input | Discount preview shown in green |
| Below minimum | "Minimum redemption is 100 points" error message |
| Not multiple of 100 | "Points must be in multiples of 100" error message |
| Exceeds balance | "You don't have enough points" error message |
| Redeeming | Existing checkout loading state covers this |

### Types

**File:** `src/types/order.ts`

No new types needed. `CheckoutRequest.redeemedPoints` and `CheckoutResponse.discountAmount` already exist.

**However:** The current `OrderResponse` has `discountAmount: number` added — this should be REMOVED since the backend does NOT return `discountAmount` on the order detail endpoint. Only `CheckoutResponse` has it.

### Components Affected

| Component | Change |
|---|---|
| `CheckoutForm.tsx` | Fix balance field, fix rate (1000→100), add Zod validation, fix "Use max" rounding |
| `OrderSummary.tsx` | Optionally show discount line and adjusted total |

## Data Flow

```
CheckoutForm
  ↓
usePointsBalance() → GET /api/loyalty/balance → { balance, discountEquivalent }
  ↓
User enters 500 points → validate (≥100, %100=0, ≤balance)
  ↓
Preview: "You'll save 50,000 VND with this redemption"
  ↓
OrderSummary: show -50,000 VND discount line
  ↓
Place Order → POST /api/checkout { paymentMethod, redeemedPoints: 500 }
  ↓
CheckoutResponse: { discountAmount: 50000, paidAmount: ... }
  ↓
Redirect to orders
```
