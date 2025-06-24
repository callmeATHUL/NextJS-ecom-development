import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Sulthana Fitness',
  description: 'Review the terms and conditions for using Sulthana Fitness Store.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-4 text-gray-700">
        By using our website, you agree to comply with our terms and conditions. Please read them carefully before making any purchase or using our services.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>All sales are subject to our return and refund policy.</li>
        <li>Unauthorized use of our content is prohibited.</li>
        <li>We reserve the right to update these terms at any time.</li>
      </ul>
      <p className="text-gray-600">Contact us if you have any questions about our terms.</p>
    </div>
  );
} 