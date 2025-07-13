import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CreditCard, CheckCircle } from 'lucide-react';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentSetupProps {
  onComplete: (paymentMethodId: string) => void;
  onSkip: () => void;
  userInfo: {
    email: string;
    username: string;
    phone: string;
  };
}

const PaymentSetupForm: React.FC<PaymentSetupProps> = ({ onComplete, onSkip, userInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Create setup intent when component mounts
    fetch('/api/stripe/setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userInfo.email,
        name: userInfo.username,
        phone: userInfo.phone,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError('Failed to initialize payment setup');
        }
      })
      .catch(() => setError('Network error'));
  }, [userInfo]);

  const handleSubmit = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setIsLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: userInfo.email,
          name: userInfo.username,
          phone: userInfo.phone,
        },
      },
    });

    if (error) {
      setError(error.message || 'An error occurred');
    } else if (setupIntent.payment_method) {
      setIsSuccess(true);
      setTimeout(() => {
        onComplete(setupIntent.payment_method as string);
      }, 1500);
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Payment Method Added!</h3>
          <p className="text-gray-400">Your card has been securely saved</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Information
          </label>
          <div className="p-4 bg-[#1A1A1A] border border-gray-600 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#6b7280',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <CreditCard className="w-4 h-4 text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-400 font-medium">Secure Payment</p>
              <p className="text-gray-400">Your card will be securely saved for future deposits. No charges will be made now.</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleSubmit}
          disabled={!stripe || isLoading}
          className="w-full bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-semibold py-3"
        >
          {isLoading ? 'Securing Card...' : 'Add Payment Method'}
        </Button>
        
        <Button
          variant="outline"
          onClick={onSkip}
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
};

export const PaymentSetup: React.FC<PaymentSetupProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <Card className="bg-[#2D2D2D] border-gray-700 p-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white">Add Payment Method</h2>
            <p className="text-gray-400">Securely save a card for easy wallet deposits</p>
          </div>
          <PaymentSetupForm {...props} />
        </div>
      </Card>
    </Elements>
  );
};