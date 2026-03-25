import { Bike, Truck, Cable, Globe, Warehouse, PackageOpen, Utensils} from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { UtensilsCrossed } from "lucide-react";

export const slides = [
  {
    image: "/tracking.svg",
    title: "Track Every Order",
    description: "Follow meals, pharmacy items, groceries, and parcels in real time.",
  },
  {
    image: "/delivery.svg",
    title: "Fast Local Delivery",
    description: "Get reliable same-day delivery with live status updates.",
  },
  {
    image: "/food.svg",
    title: "Sell and Fulfill with Ease",
    description: "Merchants manage stores while riders complete deliveries seamlessly.",
  },
];

export const states = [
  {
    id: 1,
    state: "Akwa Ibom",
    capital: "Uyo",
    abbreviation: "Uyo",
  },
  {
    id: 2,
    state: "Rivers",
    capital: "Port Harcourt",
    abbreviation: "Port",
  },
  {
    id: 3,
    state: "Benin",
    capital: "Benin City",
    abbreviation: "Benin",
  },
];

export const customerActions = [
  {
    title: "Dispatch",
    description: "Send parcels with reliable pickup and drop-off.",
    icon: Bike,
    path: "/dispatch/type",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Order Now",
    description: "Order meals and essentials from nearby stores.",
    icon: UtensilsCrossed,
    path: "/food",
    color: "text-primary-2",
    bgColor: "bg-primary-2/10",
  },
];


export const services = [
  {
    title: "Multi-Category Ordering",
    content: "Order from restaurants, pharmacies, and supermarkets in one app.",
    icon: Truck,
  },
  {
    title: "Merchant Store Management",
    content: "Manage menu items, product categories, orders, and availability from one dashboard.",
    icon: Globe,
  },
  {
    title: "Rider Delivery Network",
    content:
      "Dispatch riders quickly and keep customers updated from pickup to delivery.",
    icon: Cable,
  },
  {
    title: "Real-time Tracking",
    content:
      "Track every order with transparent status updates and notifications.",
    icon: Warehouse,
  },
];

export const offers = [
  {
    icon: PackageOpen,
    image: "/img6.jpg",
    title: "Lani Merchant",
    content:
      "Run your store online, organize products by category, and manage incoming orders from one place.",
  },
  {
    icon: Utensils,
    image: "/img4.jpg",
    title: "Lani Delivery Network",
    content:
      "Connect customers to nearby merchants with fast, dependable rider fulfillment.",
  },
];

export const faqs = [
  {
    question: "What is Lani?",
    answer:
      "Lani is a delivery platform that connects customers, merchants, and riders. Customers place orders, merchants fulfill them, and riders complete delivery.",
  },
  {
    question: "Who can use Lani?",
    answer:
      "Customers can order items, merchants can manage stores and orders, and riders can accept and complete deliveries through the platform.",
  },
  {
    question: "What can customers order on Lani?",
    answer:
      "Customers can order meals, pharmacy essentials, supermarket products, and request parcel dispatch where available.",
  },
  {
    question: "How do I track an order?",
    answer:
      "Every order includes tracking and status updates so you can monitor progress from confirmation to delivery.",
  },
];

export const socials = [
  {
    icon: FaInstagram,
    name: "@lani",
    link: "",
  },
  {
    icon: FaFacebook,
    name: "Lani",
    link: "",
  },
  {
    icon: FaWhatsapp,
    name: "Lani Community",
    link: "",
  },
];
