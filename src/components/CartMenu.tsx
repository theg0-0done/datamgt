import { X, Trash2, ArrowRight } from "lucide-react";

export function CartMenu({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: { id: string; name: string; price: string; image: string; quantity: number }[];
  onRemoveFromCart: (id: string) => void;
}) {
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceStr = item.price.replace(/[^0-9.]/g, "");
      const price = parseFloat(priceStr);
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    let message = "Hello! I would like to checkout the following items:\n\n";
    cart.forEach(item => {
        message += `- ${item.name} (x${item.quantity}) - ${item.price}\n`;
        message += `  Image: ${window.location.origin}${item.image}\n\n`;
    });
    
    message += `*Total: $${calculateTotal()}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/212762895481?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-m-card shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-m-border flex justify-between items-center">
          <h2 className="text-[24px] font-bold flex items-center gap-2">
            Your Cart
            <span className="bg-m-red text-white text-[12px] px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-m-border rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-m-ink-muted">
              <div className="w-24 h-24 bg-m-border rounded-full flex items-center justify-center mb-4">
                <Trash2 className="h-10 w-10 opacity-50" />
              </div>
              <p className="text-[16px] font-medium">Your cart is empty.</p>
              <button 
                onClick={onClose}
                className="mt-6 text-m-red hover:underline font-bold text-[14px]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-m-border pb-6 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-m-border rounded-[12px] p-2 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[14px] leading-tight mb-1">
                        {item.name}
                      </h4>
                      <p className="text-m-red font-bold text-[14px]">
                        {item.price}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[12px] font-medium opacity-70">
                        Qty: {item.quantity}
                      </span>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-m-ink-muted hover:text-m-red transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-m-border bg-gradient-to-t from-m-card to-transparent">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium opacity-80">Subtotal</span>
              <span className="font-bold text-[24px]">${calculateTotal()}</span>
            </div>
            <button 
                onClick={handleCheckout}
                className="w-full bg-m-red hover:bg-[#a11f24] text-white py-[16px] rounded-[12px] font-bold text-[16px] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Checkout on WhatsApp <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-center text-[11px] text-m-ink-muted mt-4">
               Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
