'use client'

import { useCart } from '@/components/cart/cart-provider'
import { formatPrice } from '@/lib/shopify/utils'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function CheckoutPage() {
  const { cart, totalQuantity, cartLines } = useCart()
  const [placed, setPlaced] = useState(false)

  const subtotal = cart?.cost.subtotalAmount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : 0

  if (placed) {
    return (
      <div className="min-h-screen flex items-center justify-center -mt-10">
        <div className="bg-secondary/50 p-12 text-center rounded-2xl border border-border">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-heading text-4xl mb-4">ORDER SUCCESSFUL!</h1>
          <p className="text-muted-foreground">Thank you for your purchase.</p>
          <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="font-heading text-4xl mb-8">SECURE CHECKOUT</h1>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setPlaced(true); }}>
            <h3 className="font-heading text-xl">Contact Information</h3>
            <input required type="email" placeholder="Email" className="w-full bg-secondary border border-border rounded p-3" />
            <h3 className="font-heading text-xl pt-4">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="First Name" className="w-full bg-secondary border border-border rounded p-3" />
              <input required placeholder="Last Name" className="w-full bg-secondary border border-border rounded p-3" />
            </div>
            <input required placeholder="Address" className="w-full bg-secondary border border-border rounded p-3" />
            <input required placeholder="City" className="w-full bg-secondary border border-border rounded p-3" />
            
            <h3 className="font-heading text-xl pt-4">Payment</h3>
            <div className="bg-card border border-border rounded p-4 text-sm text-muted-foreground flex items-center gap-4">
              <CreditCard className="w-6 h-6" />
              Simulated Payment Processing
            </div>

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 font-heading tracking-wider">
              PAY NOW (USD)
            </Button>
          </form>
        </div>

        <div className="bg-secondary/20 p-8 rounded-xl border border-border h-fit">
          <h2 className="font-heading text-2xl mb-6">ORDER SUMMARY</h2>
          <div className="space-y-4 mb-6 relative">
            {cartLines.map((line) => (
              <div key={line.id} className="flex justify-between text-sm">
                <span>{line.quantity}x {line.merchandise.product.title}</span>
                <span className="text-primary font-medium">
                   {formatPrice({ amount: String(parseFloat(line.merchandise.price.amount) * line.quantity), currencyCode: 'USD' })}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border/50 pt-4 flex justify-between font-heading text-xl">
            <span>Total</span>
            <span className="text-primary">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
