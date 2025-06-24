import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy | Sulthana Fitness',
  description: 'Understand our returns and refunds process for a hassle-free shopping experience.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">Returns & Refunds Policy</h1>
      <p className="mb-4 text-gray-700">
        We want you to be completely satisfied with your purchase. Please review our returns and refunds policy for information on how to return items and request refunds.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Returns are accepted within 30 days of delivery.</li>
        <li>Items must be unused and in original packaging.</li>
        <li>Refunds are processed within 5-7 business days after approval.</li>
      </ul>
      <p className="text-gray-600">Contact us for assistance with returns or refunds.</p>
    </div>
  );
} 