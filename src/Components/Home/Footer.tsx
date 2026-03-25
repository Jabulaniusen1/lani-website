import { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Input } from "../UI";
const Footer = () => {
      const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required");
            return;
        }
        // Handle subscription logic here
        console.log("Subscribed with email:", email);
        setEmail("");
        setError("");
    };
  return (
    <footer data-aos="fade-up" className="bg-gray-800 rounded-t-xl text-white py-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-xl font-bold mb-4">About Us</h2>
                        <p className="text-gray-400">
                            Lani powers everyday ordering and delivery by connecting customers, merchants, and riders in one reliable platform.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                        <ul className="space-y-2">
                            <li><a href="#home" className="hover:text-gray-300">Home</a></li>
                            <li><a href="#about" className="hover:text-gray-300">About Us</a></li>
                            <li><a href="#services" className="hover:text-gray-300">Services</a></li>
                            <li><a href="#contact" className="hover:text-gray-300">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Stay Connected</h2>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="hover:text-gray-300"><Facebook size={24} /></a>
                            <a href="#" className="hover:text-gray-300"><Twitter size={24} /></a>
                            <a href="#" className="hover:text-gray-300"><Instagram size={24} /></a>
                            <a href="#" className="hover:text-gray-300"><Linkedin size={24} /></a>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex">
                            <Input
                                type="email"
                                placeholder="Subscribe to our newsletter"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                styles="bg-white rounded-l-xl rounded-r-none text-black"
                            />
                            <button type="submit" className="bg-primary text-white px-4 rounded-r-xl">
                                <Mail size={20} />
                            </button>
                        </form>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                </div>
                <div className="text-center mt-8 border-t border-gray-700 pt-4">
                    <p className="text-gray-400 text-sm">© 2026 Lani. All rights reserved.</p>
                </div>
            </div>
        </footer>
  )
}

export default Footer
