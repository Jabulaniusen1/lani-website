import { Send, User, Mail } from "lucide-react";
import {Input} from "@/Components/UI"
import Title from "./Title";
import { socials } from "@/Constants/data";

import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

const Contacts = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name && !form.email && !form.message)
      toast.error("All fields are required!");
    else if (!form.name) toast.error("Name is required!");
    else if (!form.email) toast.error("E-mail is required!");
    else if (!form.message) toast.error("Message is required!");
    else toast.success("Form submitted!");
  };
  return (
    <>
      <section id="contact">
        <Title main="Contact" sub="Us" />

        <div data-aos="fade-up" className="flex md:flex-row flex-col my-10 gap-10">
          <div className="flex-1">
            {/* <h3 className="text-2xl font-semibold text-sub">Get in Touch</h3> */}

            <form
              onSubmit={handleSubmit}
              className=" text-main rounded-3xl flex-1 flex flex-col gap-6 "
            >
              <Input
                id="name"
                type="text"
                label="Full Name"
                placeholder="Enter fullname"
                // styles="bg-mid"
                value={form.name}
                onChange={handleChange}
                icon={<User size={20} />}
              />
              <Input
                id="email"
                type="text"
                label="E-mail Address"
                placeholder="Enter contact e-mail address"
                // styles="bg-mid"
                value={form.email}
                onChange={handleChange}
                icon={<Mail size={20} />}
              />
              <div className="f flex-col gap-1">
                <label htmlFor="message" className="text-sm">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  placeholder="Write message"
                  value={form.message}
                  onChange={handleChange}
                  className=" px-4 py-2 rounded-xl text-sm placeholder:text-sm placeholder:font-dm text-main w-full placeholder:text-sub border border-line focus-within:ring-[3px] ring-offset-0 focus-within:ring-orange-500/50 focus-within:border-primary_1 bg-background"
                ></textarea>
              </div>
              <button type="submit" className="btn bg-primary text-white h-10 rounded-full">
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>
          </div>
          <div className="flex-1 text-main">
            <h3 className="text-2xl font-semibold">
              Follow on all socials
            </h3>
            <ul className="flex flex-col gap-2 mt-4">
              {socials.map((x, y) => (
                <li data-aos="fade-right" key={y}>
                  <a
                    href={x.link || "#"}
                    target={x.link ? "_blank" : undefined}
                    rel={x.link ? "noopener noreferrer" : undefined}
                    className="border border-line hover:scale-[1.05] duration-200 flex items-center gap-4 bg-background p-2 rounded-xl"
                  >
                    <x.icon size={30} />
                    <span className="text-sub">{x.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contacts;
