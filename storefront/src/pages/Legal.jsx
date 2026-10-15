import React from "react";
import { Link } from "react-router-dom";
import { site } from "../config/site";

// Starter wording describing how the platform works today. Have it reviewed before launch.
const documents = {
  privacy: {
    title: "Privacy",
    accent: "Policy",
    intro: `This policy explains what ${site.name} collects when you use this website and how we use it.`,
    sections: [
      {
        heading: "Information we collect",
        body: [
          "Contact details you give us when you place an order, submit a product request, or create an account: your name, phone number, email address, and delivery address.",
          "Order and request details: the items, quantities, links and notes you send us.",
          "Reviews you choose to post, shown publicly with the name you enter.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To confirm, source, ship, and deliver your orders and requests.",
          "To contact you about quotes, payment, and delivery.",
          "To keep the website secure and prevent abuse.",
        ],
      },
      {
        heading: "What stays on your device",
        body: [
          "Your cart and wishlist are stored in your browser, not on our servers, until you place an order.",
          "If you log in, a cookie keeps you signed in.",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We share only what is needed with the suppliers, freight and delivery partners who fulfil your order.",
          "We do not sell your personal information.",
        ],
      },
      {
        heading: "Order tracking",
        body: [
          "Anyone with your order or reference number can view its status and contents on the tracking page. Your name, phone number, and address are never shown there, but treat the number as private.",
        ],
      },
      {
        heading: "Your choices",
        body: [`To see, correct, or delete the information we hold about you, contact us at ${site.email}.`],
      },
    ],
  },
  terms: {
    title: "Terms of",
    accent: "Service",
    intro: `These terms apply when you order from or send a request to ${site.name} through this website.`,
    sections: [
      {
        heading: "Orders",
        body: [
          "Placing an order on the website is a request to buy. No payment is taken online; the order is confirmed once our team has contacted you and payment has been arranged.",
          "Prices are shown in Ghana cedis (GH₵). Sale and group-buy prices apply while they are shown on the product page.",
        ],
      },
      {
        heading: "Shipping and customs",
        body: [
          "Shipping and customs amounts shown when you order are estimates based on item weight and value. We will confirm the final amounts with you before you pay.",
          "Delivery times for sea and air freight are estimates and can change because of supplier, carrier, or customs delays.",
        ],
      },
      {
        heading: "Custom product requests",
        body: [
          "A request is not an order. We will review it and send a quote; you decide whether to go ahead.",
          "Quotes are valid for a limited time because supplier prices and exchange rates change.",
        ],
      },
      {
        heading: "Cancellations and problems",
        body: [
          "Contact us as soon as possible if you need to change or cancel. Once goods have been bought from the supplier, cancellation may not be possible.",
          "If an item arrives damaged or is not what you ordered, tell us promptly with photos so we can resolve it.",
        ],
      },
      {
        heading: "Reviews",
        body: ["Reviews should be honest and about the product. We may remove reviews that are abusive, misleading, or spam."],
      },
      {
        heading: "Contact",
        body: [`Questions about these terms: ${site.email} or ${site.phoneDisplay}.`],
      },
    ],
  },
};

export default function Legal({ type }) {
  const doc = documents[type];

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="eyebrow mb-1.5">{site.name}</p>
          <h1 className="font-head text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {doc.title} <span className="text-gradient">{doc.accent}</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">{doc.intro}</p>
        </div>

        <div className="panel p-6 sm:p-8 space-y-7">
          {doc.sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="font-head text-base font-bold text-gray-900 mb-2">
                <span className="text-primary mr-2">{String(index + 1).padStart(2, "0")}</span>
                {section.heading}
              </h2>
              <ul className="space-y-2">
                {section.body.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          See also our{" "}
          <Link to={type === "privacy" ? "/terms-of-service" : "/privacy-policy"} className="text-primary hover:underline">
            {type === "privacy" ? "Terms of Service" : "Privacy Policy"}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
