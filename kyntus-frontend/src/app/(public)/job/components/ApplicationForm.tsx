"use client";

import React, { useState, ChangeEvent, FormEvent, useRef, useEffect, useCallback, useMemo, memo } from "react";
// 🚨 Zedt Variants hna f l'import
import { motion, AnimatePresence, Variants } from "framer-motion";
import styles from "../job.module.css";

const TypewriterText = memo(({ text, delayOffset = 0, className = "", cursor = true }: { text: string; delayOffset?: number; className?: string; cursor?: boolean; }) => {
  // 🚨 Zedt <Variants> l' useMemo bach Vercel maybkich
  const containerVariants = useMemo<Variants>(() => ({ visible: { transition: { staggerChildren: 0.03, delayChildren: delayOffset } } }), [delayOffset]);
  const charVariants = useMemo<Variants>(() => ({ hidden: { opacity: 0, display: "none" }, visible: { opacity: 1, display: "inline-block", color: "#ffffff" } }), []);
  const cursorVariants = useMemo<Variants>(() => ({ hidden: { opacity: 0 }, visible: { opacity: [0, 1, 0], transition: { repeat: Infinity, duration: 0.8, ease: "linear" } } }), []);

  return (
    <motion.span className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={containerVariants}>
      {Array.from(text).map((char, i) => <motion.span key={i} variants={charVariants}>{char === " " ? "\u00A0" : char}</motion.span>)}
      {cursor && <motion.span variants={cursorVariants} style={{ display: "inline-block", width: "10px", height: "1.1em", backgroundColor: "#ffffff", verticalAlign: "text-bottom", marginLeft: "6px" }} />}
    </motion.span>
  );
});
TypewriterText.displayName = "TypewriterText";

const CyberInput = memo(({ label, name, type = "text", placeholder, value, onChange, required = true }: { label: string; name: string; type?: string; placeholder: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; required?: boolean; }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <motion.label animate={{ color: active ? "#ffffff" : "rgba(255,255,255,0.5)" }} transition={{ duration: 0.2 }} style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{label}</motion.label>
      <div style={{ position: "relative" }}>
        <input type={type} name={name} required={required} placeholder={placeholder} value={value} onChange={onChange} onFocus={handleFocus} onBlur={handleBlur} style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", outline: "none", color: "#ffffff", fontFamily: "monospace", fontSize: "1.05rem", padding: "0.6rem 0", width: "100%", caretColor: "#ffffff", transition: "border-color 0.3s" }} />
        <motion.div animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeOut" }} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "#ffffff", transformOrigin: "left" }} />
      </div>
    </div>
  );
});
CyberInput.displayName = "CyberInput";

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ApplicationForm() {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", position: "", file: null as File | null });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [activeOffers, setActiveOffers] = useState<{id: number, title: string}[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/job-offers/active")
      .then(res => res.json())
      .then(data => setActiveOffers(data))
      .catch(err => console.error("Error fetching offers", err));
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setFormData((p) => ({ ...p, [name]: value })); }, []);
  const handleFile = useCallback((file: File) => { setFormData((p) => ({ ...p, file })); }, []);
  const toggleDropdown = useCallback(() => setIsDropdownOpen(p => !p), []);
  const selectRole = useCallback((role: string) => { setFormData(p => ({ ...p, position: role })); setIsDropdownOpen(false); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.position) return;
    setStatus("submitting");

    const data = new FormData();
    data.append("fullName", formData.fullName); 
    data.append("email", formData.email); 
    if (formData.phone) data.append("phone", formData.phone); 
    data.append("cvFile", formData.file);

    const selectedOffer = activeOffers.find(o => o.title === formData.position);
    if (selectedOffer) {
      data.append("offerId", selectedOffer.id.toString());
    }

    try {
      const res = await fetch("http://localhost:8081/api/job-applications/apply", { method: "POST", body: data });
      if (res.ok) { setStatus("success"); setTimeout(() => { setStatus("idle"); setFormData({ fullName: "", email: "", phone: "", position: "", file: null }); }, 4000); } 
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  // 🚨 Zedt <Variants> l' useMemo hna bach ydowezha Vercel f l' balise ta7t
  const itemVar = useMemo<Variants>(() => ({ hidden: { opacity: 0, y: 16 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } }) }), []);

  return (
    <section className={styles.formSection} style={{ position: "relative", width: "100%", maxWidth: "750px", zIndex: 50 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", background: "rgba(0, 15, 50, 0.96)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 40px 80px rgba(0, 5, 20, 0.6)", overflow: "visible" }}
      >
        <div style={{ position: "relative", zIndex: 10, padding: "4rem 3.5rem" }}>
          
          <motion.div custom={0} variants={itemVar} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
            <h3 style={{ fontFamily: "monospace", fontSize: "2rem", fontWeight: 900, color: "#ffffff", marginBottom: "0.5rem", letterSpacing: "-1px" }}>
              <TypewriterText text="Identity Protocol" delayOffset={0.2} />
            </h3>
            <p style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
              <TypewriterText text="Establish secure connection to Kyntus node..." delayOffset={1.0} cursor={false} />
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
              
              <motion.div custom={1} variants={itemVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <CyberInput label="Target_Name" name="fullName" placeholder="Enter designation..." value={formData.fullName} onChange={handleInputChange} />
              </motion.div>
              <motion.div custom={2} variants={itemVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <CyberInput label="Comms_Link" name="email" type="email" placeholder="name@domain.com" value={formData.email} onChange={handleInputChange} />
              </motion.div>
              <motion.div custom={3} variants={itemVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <CyberInput label="Signal_Freq" name="phone" type="tel" placeholder="+212 6XX XXX XXX" value={formData.phone} onChange={handleInputChange} required={false} />
              </motion.div>

              {/* ── DYNAMIC DROPDOWN ── */}
              <motion.div custom={4} variants={itemVar} initial="hidden" whileInView="visible" viewport={{ once: true }} ref={dropdownRef} style={{ position: "relative", zIndex: isDropdownOpen ? 50 : 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <motion.label animate={{ color: isDropdownOpen || formData.position ? "#ffffff" : "rgba(255,255,255,0.5)" }} style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                    Select_Role
                  </motion.label>
                  <div style={{ position: "relative" }}>
                    <div onClick={toggleDropdown} style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", padding: "0.6rem 0" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "1.05rem", color: formData.position ? "#ffffff" : "rgba(255,255,255,0.4)", flex: 1 }}>{formData.position || "Select role..."}</span>
                      <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }} style={{ color: "#ffffff", fontSize: "0.7rem" }}>▼</motion.span>
                    </div>
                    <motion.div animate={{ scaleX: isDropdownOpen ? 1 : 0 }} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "#ffffff", transformOrigin: "left" }} />

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -5, scaleY: 0.9 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -5, scaleY: 0.9 }} transition={{ duration: 0.2 }}
                          style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 100, background: "rgba(0, 15, 50, 0.98)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "0.4rem", listStyle: "none", margin: 0, transformOrigin: "top", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                        >
                          {activeOffers.map((offer) => (
                            <motion.li key={offer.id} onClick={() => selectRole(offer.title)} whileHover={{ x: 5, color: "#ffffff" }} style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", padding: "0.8rem 1rem", cursor: "pointer", transition: "color 0.2s" }}>
                              {offer.title}
                            </motion.li>
                          ))}
                          <motion.li onClick={() => selectRole("Candidature Spontanée")} whileHover={{ x: 5, color: "#ffffff" }} style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", padding: "0.8rem 1rem", cursor: "pointer", transition: "color 0.2s", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "4px" }}>
                            Candidature Spontanée
                          </motion.li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* ── FILE UPLOAD ── */}
              <motion.div custom={5} variants={itemVar} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <motion.label animate={{ color: formData.file ? "#ffffff" : "rgba(255,255,255,0.5)" }} style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Payload_Inject</motion.label>
                  <motion.div onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }} animate={{ borderColor: formData.file ? "#ffffff" : isDragging ? "#ffffff" : "rgba(255,255,255,0.2)", background: isDragging ? "rgba(255,255,255,0.05)" : "transparent" }} style={{ borderRadius: "8px", padding: "2rem", cursor: "pointer", textAlign: "center", minHeight: 110, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed" }}>
                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" required onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} style={{ display: "none" }} />
                    <AnimatePresence mode="wait">
                      {formData.file ? (
                        <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "1.1rem", color: "#ffffff", fontWeight: 800 }}>{formData.file.name}</span>
                          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>[ OVERWRITE PACKET ]</span>
                        </motion.div>
                      ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "0.95rem", color: "#ffffff", letterSpacing: "1px" }}>&lt; DROP_ENCRYPTED_FILE_HERE &gt;</span>
                          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>.PDF · .DOCX — Max 5MB</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>

              {/* ── SUBMIT BUTTON ── */}
              <motion.div custom={6} variants={itemVar} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
                <motion.button type="submit" disabled={status === "submitting" || status === "success"} whileHover={status === "idle" || status === "error" ? { scale: 1.01, backgroundColor: "#e2e8f0" } : {}} whileTap={{ scale: 0.99 }} animate={{ background: status === "success" ? "#2EED2E" : status === "error" ? "#ef4444" : "#ffffff", color: status === "success" ? "#001540" : status === "error" ? "#ffffff" : "#001540" }} style={{ width: "100%", padding: "1.2rem", border: "none", borderRadius: "8px", cursor: status === "idle" || status === "error" ? "pointer" : "default", fontFamily: "monospace", fontSize: "1rem", fontWeight: 900, letterSpacing: "2px", transition: "all 0.3s" }}>
                  {status === "submitting" ? "UPLOADING..." : status === "success" ? "ACCESS GRANTED" : status === "error" ? "CONNECTION REFUSED" : "EXECUTE_TRANSFER()"}
                </motion.button>
              </motion.div>

            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
}