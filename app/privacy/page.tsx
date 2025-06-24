import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sulthana Fitness',
  description: 'Read our privacy policy to understand how we protect your data and privacy at Sulthana Fitness.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">
        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>We do not sell or share your personal data with third parties.</li>
        <li>All information is securely stored and only used to improve your experience.</li>
        <li>You can contact us at any time to request data removal or updates.</li>
      </ul>
      <p className="text-gray-600">For more details, please contact our support team.</p>
    </div>
  );
} 