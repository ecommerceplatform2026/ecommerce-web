# US 6.4 — Display Points Reversal for Returned Orders (ABC-249)

## What

Show points reversal info on the order detail page when an order is cancelled/returned. Reflect updated balance on profile after cancellation.

## Backend API

### POST /api/orders/{id}/cancel

Cancels the order. The backend triggers `CancelPendingTransactionsForOrderAsync` which:
- Cancels pending Earn transactions (removes pending points)
- Cancels pending Redeem transactions (refunds available points)
- Rolls back loyalty account state

**Response:**
```json
{
    "isSuccess": true,
    "message": null,
    "data": {
        "orderId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "orderCode": 12345,
        "status": "Cancelled",
        "refundedPoints": 500,
        "refundDescription": "Cancelled pending redeem transaction for cancelled order."
    }
}
```

| Field | Type | Description |
|---|---|---|
| `orderId` | guid | Cancelled order ID |
| `orderCode` | int | Order code |
| `status` | string | `"Cancelled"` |
| `refundedPoints` | int? | Points refunded (null if none) |
| `refundDescription` | string? | Auto-generated description |

### Backend Reversal Logic (LoyaltyService.CancelPendingTransactionsForOrderAsync)

When order is cancelled:
- **Earn transactions**: Cancelled, `PendingPoints` deducted from account
- **Redeem transactions**: Cancelled, `AvailablePoints` refunded to account
- Points refunded = sum of all cancelled transaction points

### GET /api/loyalty/balance

After cancellation, the balance reflects the reversal. Use this to show updated balance.

## Implementation Steps

### ST 6.4.1 — Points Reversal Status on Order Detail

**File:** `src/app/(shop)/orders/[id]/page.tsx`

When the order status is `Cancelled` and the order involved points (either earned or redeemed):

1. **Check if order had points involvement:**
   - The current `OrderResponse` doesn't include `discountAmount` or `earnedPoints`
   - Approach: Pass `discountAmount` from the checkout response, or check if `refundedPoints` from the cancel API is > 0
   - Since the cancel API returns `refundedPoints`, we can show the reversal based on that

2. **Add reversal callout in the order detail:**
```
┌─────────────────────────────────────────┐
│  ⚠ Order Cancelled                     │
│  ─────────────────────────────────────  │
│  Items Subtotal                  500,000│
│  ─────────────────────────────────────  │
│  Order Total                     500,000│
│                                         │
│  ┌─ Points Reversal ──────────────────┐│
│  │ 🔄 500 points have been refunded  ││
│  │    to your account.               ││
│  └────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

3. **States:**
   - **Order not cancelled:** Hide section
   - **Cancelled with no points:** Show order cancelled status only (existing)
   - **Cancelled with refunded points:** Show reversal callout with refund amount
   - **Loading:** No extra state — the order is already loaded

4. **Data source for refundedPoints:**
   Option A: Store `discountAmount` from checkout response and compute `refundedPoints = discountAmount / 100`
   Option B: Use the cancel API response which includes `refundedPoints`
   Option C: Extend `OrderResponse` to include points info

   **Recommended:** Option B — after cancelling, store the cancel response data and display it.

### ST 6.4.2 — Balance Update After Reversal

**File:** `src/app/(shop)/profile/page.tsx` (or relevant profile content)

When the user navigates to the profile page after a cancellation, the balance API returns updated values:
- Available points: refunded (if redeem was cancelled)
- Balance: decreased (if earn was cancelled)

**Implementation:**
1. The `PointsBalanceCard` on profile already calls `usePointsBalance()` which auto-refreshes
2. No additional work needed — React Query's cache invalidation handles this
3. If real-time update is needed after cancel, invalidate the query:
```ts
queryClient.invalidateQueries({ queryKey: ['loyalty', 'balance'] })
```

### Additional: Invalidate Balance on Cancel

**File:** `src/hooks/useOrders.ts` — `useCancelOrder` mutation

Add invalidation of loyalty balance when an order is cancelled:

```ts
export function useCancelOrder() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => orderService.cancelOrder(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all })
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: ['loyalty', 'balance'] }) // ← add this
        },
    })
}
```

## Types

**File:** `src/types/order.ts`

Add `CancelOrderResponse` type:
```ts
export interface CancelOrderResponse {
    orderId: string
    orderCode: number
    status: string
    refundedPoints?: number | null
    refundDescription?: string | null
}
```

Update `src/services/orderService.ts` — change `cancelOrder` to return the response:
```ts
cancelOrder: async (id: string): Promise<CancelOrderResponse> => {
    const res = await axiosInstance.post<ApiResponse<CancelOrderResponse>>(
        ORDER_ENDPOINTS.CANCEL(id),
    )
    return res.data.data
}
```

Update `src/hooks/useOrders.ts` — `useCancelOrder` to use the response:
```ts
export function useCancelOrder() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => orderService.cancelOrder(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all })
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: ['loyalty', 'balance'] })
            // Store refundedPoints for display on order detail
            if (data?.refundedPoints) {
                // Optionally update cache
            }
        },
    })
}
```

## Data Flow

```
Order Detail Page (Pending/Confirmed status)
  ↓
User clicks "Cancel Order"
  ↓
POST /api/orders/{id}/cancel
  ↓
Response: { refundedPoints: 500 }
  ↓
Show reversal callout: "500 points refunded to your account"
  ↓
Invalidate ['loyalty', 'balance'] → profile shows updated balance
```
