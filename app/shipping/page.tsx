import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Sulthana Fitness',
  description: 'Learn about our shipping process, delivery times, and shipping charges.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">Shipping Policy</h1>
      <p className="mb-4 text-gray-700">
        We strive to deliver your orders quickly and safely. Please review our shipping policy for details on delivery times, charges, and service areas.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Standard shipping takes 3-5 business days.</li>
        <li>Free shipping on orders above SAR 200.</li>
        <li>Tracking information will be provided once your order is shipped.</li>
      </ul>
      <p className="text-gray-600">For shipping inquiries, contact our support team.</p>
    </div>
  );
} 