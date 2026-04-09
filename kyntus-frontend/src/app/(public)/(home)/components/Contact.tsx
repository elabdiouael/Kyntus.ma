"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import styles from "./contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.tagline}>Get In Touch</h2>
          <h3 className={styles.title}>Let's Build Something Great</h3>
          <p className={styles.description}>
            Ready to transform your business? Drop us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Contact Info */}
          <div className={styles.infoWrapper}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.infoItem}
            >
              <div className={`${styles.iconBox} ${styles.iconBlue}`}>
                <MapPin size={24} className={styles.iconBlueText} />
              </div>
              <div>
                <h4 className={styles.infoTitle}>Our Location</h4>
                <p className={styles.infoText}>Technopark, Oujda<br/>Morocco</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={styles.infoItem}
            >
              <div className={`${styles.iconBox} ${styles.iconPurple}`}>
                <Mail size={24} className={styles.iconPurpleText} />
              </div>
              <div>
                <h4 className={styles.infoTitle}>Email Us</h4>
                <p className={styles.infoText}>contact@kyntus.com<br/>support@kyntus.com</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={styles.infoItem}
            >
              <div className={`${styles.iconBox} ${styles.iconCyan}`}>
                <Phone size={24} className={styles.iconCyanText} />
              </div>
              <div>
                <h4 className={styles.infoTitle}>Call Us</h4>
                <p className={styles.infoText}>+212 5XX XX XX XX<br/>Mon-Fri, 9am-6pm</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={styles.formWrapper}
          >
            <form className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input type="text" placeholder="John Doe" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input type="email" placeholder="john@company.com" className={styles.input} />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Subject</label>
                <input type="text" placeholder="How can we help?" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Message</label>
                <textarea rows={4} placeholder="Tell us about your project..." className={styles.textarea}></textarea>
              </div>
              <button className={styles.submitBtn}>
                Send Message
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}