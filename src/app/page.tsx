"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import ContentCopyIcon from "./ContentCopyIcon";

import CityToTeamsAnimation from "./CityToTeamsAnimation";
import communities from "../data/communities.json";
import { text } from "stream/consumers";
// import { error } from "console"; // Remove this line to avoid conflict

/* ---------- Types ---------- */
type CommunityOption = { name: string; city_name: string; email?: string };
type NotListedOption = { inputValue: "__not_listed__"; name: string; city_name: string };
type AutocompleteOption = CommunityOption | NotListedOption;

/* ---------- Small UI helper ---------- */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", mb: 1 }}>
      <Typography sx={{ fontWeight: 600, minWidth: 120 }}>{label}:</Typography>
      <Typography sx={{ ml: 1 }}>{value || "—"}</Typography>
    </Box>
  );
}

/* ---------- Page ---------- */
export default function Page() {
  // --- Not Listed Modal state ---

  // Fix implicit any for setNotListedForm
  type NotListedFormType = typeof notListedForm;

  // --- OTP and summary handlers (stubs) ---
  const sendOtp = () => {};
  const verifyOtp = () => {};
  const submitToSheets = () => {};
  // --- Additional state and handlers for modals and email correction ---
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailCorrection, setEmailCorrection] = useState("");
  // Handler for community Autocomplete change
  const handleCommunityChange = (option: CommunityOption | null) => {
    if (!option) return;
    if ('inputValue' in option && option.inputValue === "__not_listed__") {
      setNotListedDialogOpen(true);
    } else {
      setForm(f => ({ ...f, community: option.name, city: option.city_name }));
      setEmail(option.email || "");
    }
  };
  // --- State declarations ---
  // Use 'communities' directly instead of 'allCommunities'.
  const [notListedDialogOpen, setNotListedDialogOpen] = useState(false);
  const [notListedForm, setNotListedForm] = useState({
    community: "",
    city: "",
    management: "",
    phone: "",
    specials: "",
    commissionSend: "",
    commissionEscort: "",
    send: "",
    escort: "",
    flatFee: "",
    notes: "",
    email: "",
  });
  const [notListedLoading, setNotListedLoading] = useState(false);
  const [notListedError, setNotListedError] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [copied, setCopied] = useState(false);

  // --- Handler/function stubs (implement as needed) ---
  const handleSubmitFill = (e: React.FormEvent) => { e.preventDefault(); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {};
  const WEBHOOK = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEBHOOK!;

  const [form, setForm] = useState({
    community: "",
    city: "",
    management: "",
    phone: "",
    specials: "",
    commissionSend: "",
    commissionEscort: "",
    send: "",
    escort: "",
    flatFee: "",
    notes: "",
    email: "",
  });
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  // Add this for phase management
  const [phase, setPhase] = useState<"fill" | "verify" | "summary">("fill");

  // ...other hooks...
  const [formError, setFormError] = useState<string | null>(null);

  // Example: move your functions here
  // function submitToSheets() { ... }
  // function handleChange() { ... }
  // etc.

  // Example function (move all your real functions here):
  // const submitToSheets = async () => { ... };
  // const handleChange = (e) => { ... };
  // etc.

  // Only one return at the end:
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)",
          py: { xs: 2, md: 6 },
          px: { xs: 1, md: 0 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mb: { xs: 3, md: 5 }, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 32, md: 44 },
              letterSpacing: 1,
              color: "#1a202c",
              mb: 1,
              fontFamily: "Nunito, Arial, sans-serif",
            }}
          >
            Submit a Property
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#4b5563",
              fontSize: { xs: 18, md: 22 },
              fontWeight: 400,
              maxWidth: 700,
              mx: "auto",
              fontFamily: "Nunito, Arial, sans-serif",
            }}
          >
            Get your property in front of the best locators &amp; brokers in Texas. Fast, free, and trusted by the industry.
          </Typography>
        </Box>
        {/* Main Content: Animation + Form in a flex row */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', maxWidth: 1100, mx: 'auto', mt: 2 }}>
          {/* Column 1: Animation + Info */}
          <Box sx={{ width: { xs: '100%', md: 370 }, mb: { xs: 4, md: 0 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 0, mb: 3, p: 0, m: 0, background: 'none' }}>
              <CityToTeamsAnimation style={{ width: '100%', maxWidth: 680, maxHeight: 680, opacity: 1, display: 'block', marginTop: 0 }} />
            </Box>
            <Paper elevation={0} sx={{ width: '100%', px: { xs: 3, md: 4 }, py: { xs: 4, md: 5 }, borderRadius: 3, background: '#f8fafc', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: 22, fontWeight: 600, color: '#2563eb', letterSpacing: 0.5 }}>Locators</span>
                  <span style={{ fontSize: 18, margin: '0 4px', color: '#2563eb' }}>→</span>
                  <span style={{ fontSize: 22, fontWeight: 600, color: '#2563eb', letterSpacing: 0.5 }}>Us</span>
                  <span style={{ fontSize: 18, margin: '0 4px', color: '#2563eb' }}>→</span>
                  <span style={{ fontSize: 22, fontWeight: 600, color: '#2563eb', letterSpacing: 0.5 }}>You</span>
                </Box>
                <Box sx={{ mt: 1, mb: 0 }}>
                  <span style={{ fontSize: 15, color: '#2563eb', fontWeight: 500, background: '#eff6ff', borderRadius: 6, padding: '2px 10px', letterSpacing: 0.2 }}>100% free, no catch</span>
                </Box>
              </Box>
              <Box sx={{ mb: 1, textAlign: 'center' }}>
                <span style={{ fontWeight: 500, fontSize: 16, color: '#2563eb', letterSpacing: 0.2, display: 'block', marginBottom: 4 }}>Built by locators & brokers for the community.</span>
                <span style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>We know what you need—because we needed it too.</span>
              </Box>
              <Box sx={{ fontSize: 14, color: '#94a3b8', textAlign: 'center', mt: 2 }}>
                <span style={{ fontWeight: 400 }}>Questions?</span>
                <a href="mailto:data@sparkapt.com" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 500, marginLeft: 6 }}>data@sparkapt.com</a>
              </Box>
            </Paper>
          </Box>
          {/* Column 2: Form */}
          <Box sx={{ width: { xs: '100%', md: '1px' }, flex: 1, minWidth: 0 }}>
            <Paper sx={{ p: 4, borderRadius: 3, mt: 0 }}>
              {/* Define steps and activeStep */}
              {(() => {
                const steps = ['Fill', 'Verify', 'Summary'];
                const phaseToStep: Record<string, number> = { fill: 0, verify: 1, summary: 2 };
                const activeStep = phaseToStep[phase as keyof typeof phaseToStep] ?? 0;
                return (
                  <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                );
              })()}
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>
              )}
              {/* ----- STEP 1: FILL ----- */}
              {phase === 'fill' && (
                <>
                  <form onSubmit={handleSubmitFill}>
                    {communities.length > 0 ? (
                      <>
                        <Autocomplete
                          options={communities as AutocompleteOption[]}
                          getOptionLabel={(option) => 'inputValue' in option ? option.name : option.name + (option.city_name ? ` (${option.city_name})` : '')}
                          value={form.community ? communities.find((c) => c.name === form.community && c.city_name === form.city) || null : null}
                          onChange={(_e, value) => handleCommunityChange(value as CommunityOption | null)}
                          filterOptions={(options, params) => {
                            const filtered = options.filter((option) => 'name' in option && option.name.toLowerCase().includes(params.inputValue.toLowerCase()));
                            if (params.inputValue !== '' && filtered.length === 0) {
                              filtered.push({ name: "We're not listed +", city_name: '', inputValue: '__not_listed__' });
                            }
                            return filtered;
                          }}
                          renderInput={(params) => <TextField {...params} label="Community" required fullWidth autoComplete="off" />}
                          renderOption={(props, option) => {
                            const { key, ...rest } = props;
                            if ('inputValue' in option && option.inputValue === '__not_listed__') {
                              return (
                                <li key={key} {...rest} style={{ width: '100%', color: '#2563eb', fontWeight: 600, textAlign: 'center' }}>{option.name}</li>
                              );
                            }
                            return (
                              <li key={key} {...rest} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span>{option.name}</span>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 2, fontSize: 13 }}>{(option as CommunityOption).city_name}</Typography>
                              </li>
                            );
                          }}
                          sx={{ mb: 2 }}
                          isOptionEqualToValue={(option, value) => !!option && !!value && 'name' in option && 'name' in value && option.name === value.name && ('city_name' in option ? option.city_name : '') === ('city_name' in value ? value.city_name : '')}
                          clearOnBlur={false}
                          autoHighlight
                          openOnFocus
                        />
                      </>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, minHeight: 56 }}>
                          <CircularProgress size={24} />
                        </Box>
                      </>
                    )}
                    {/* Not Listed Modal */}
                    <Dialog open={notListedDialogOpen} onClose={() => setNotListedDialogOpen(false)} maxWidth="sm" fullWidth>
                      <DialogTitle>Add Your Community</DialogTitle>
                      <DialogContent>
                        <TextField label="Community Name" name="community" value={notListedForm.community} onChange={(e) => setNotListedForm((f) => ({ ...f, community: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="City" name="city" value={notListedForm.city} onChange={(e) => setNotListedForm((f) => ({ ...f, city: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Management Company" name="management" value={notListedForm.management} onChange={(e) => setNotListedForm((f) => ({ ...f, management: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Phone Number" name="phone" value={notListedForm.phone} onChange={(e) => setNotListedForm((f) => ({ ...f, phone: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Specials" name="specials" value={notListedForm.specials} onChange={(e) => setNotListedForm((f) => ({ ...f, specials: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Commission (Send)" name="commissionSend" value={notListedForm.commissionSend} onChange={(e) => setNotListedForm((f) => ({ ...f, commissionSend: e.target.value }))} fullWidth sx={{ mb: 2 }} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                        <TextField label="Commission (Escort)" name="commissionEscort" value={notListedForm.commissionEscort} onChange={(e) => setNotListedForm((f) => ({ ...f, commissionEscort: e.target.value }))} fullWidth sx={{ mb: 2 }} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                        <TextField label="Send" name="send" value={notListedForm.send} onChange={(e) => setNotListedForm((f) => ({ ...f, send: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Escort" name="escort" value={notListedForm.escort} onChange={(e) => setNotListedForm((f) => ({ ...f, escort: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Flat Fee" name="flatFee" value={notListedForm.flatFee} onChange={(e) => setNotListedForm((f) => ({ ...f, flatFee: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Notes" name="notes" value={notListedForm.notes} onChange={(e) => setNotListedForm((f) => ({ ...f, notes: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Email" name="email" value={notListedForm.email} onChange={(e) => setNotListedForm((f) => ({ ...f, email: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setNotListedDialogOpen(false)} color="secondary" disabled={notListedLoading}>Cancel</Button>
                        <Button onClick={async () => {
                          setNotListedLoading(true);
                          setNotListedError("");
                          try {
                            const res = await fetch("/api/new-community", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(notListedForm) });
                            if (!res.ok) throw new Error("Failed to submit");
                            setNotListedDialogOpen(false);
                            setForm(notListedForm);
                            setEmail(notListedForm.email);
                            setPhase("verify");
                          } catch (err) {
                            setNotListedError("Submission failed. Please try again.");
                          } finally {
                            setNotListedLoading(false);
                          }
                        }} color="primary" variant="contained" disabled={!notListedForm.community || notListedLoading}>{notListedLoading ? "Submitting..." : "Submit"}</Button>
                        {notListedError && <Box sx={{ color: "error.main", mt: 1, mb: 1 }}>{notListedError}</Box>}
                      </DialogActions>
                    </Dialog>
                    <TextField label="Email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); setForm(f => ({ ...f, email: e.target.value })); }} fullWidth required sx={{ mb: 2 }} />
                    {form.community && (
                      <Button color="warning" variant="outlined" sx={{ mt: 1, mb: 2, alignSelf: 'flex-start' }} onClick={() => { setEmailCorrection(''); setEmailDialogOpen(true); }}>This is not our email</Button>
                    )}
                    {/* New Fields Added Here */}
                    <TextField label="Management Company" name="management" value={form.management} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Commission (Send)" name="commissionSend" value={form.commissionSend} onChange={handleChange} fullWidth sx={{ mb: 2 }} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                    <TextField label="Commission (Escort)" name="commissionEscort" value={form.commissionEscort} onChange={handleChange} fullWidth sx={{ mb: 2 }} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                    <TextField label="Specials" name="specials" value={form.specials} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Send" name="send" value={form.send} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Escort" name="escort" value={form.escort} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Flat Fee" name="flatFee" value={form.flatFee} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth multiline minRows={3} sx={{ mb: 2 }} />
                    {/* Email Correction Modal */}
                    <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { minHeight: 560, minWidth: 860, p: 0, borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.18)', background: '#f3f4f6' } }}>
                      <DialogTitle sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '2.4rem' }, textAlign: 'center', pb: 0, pt: 4, px: 0, letterSpacing: 0.2, color: '#1e293b', fontFamily: 'Nunito, Inter, Arial, sans-serif', width: '100%' }}>Update Community Email</DialogTitle>
                      <DialogContent sx={{ p: 0, mt: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 0, mt: 0, width: '100%' }}>
                          {/* Left column: Standard update */}
                          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'flex-start', background: '#f9fafb', borderRadius: { xs: 0, md: '0 0 0 40px' }, p: { xs: 4, md: 5 }, borderRight: { md: '1.5px solid #e5e7eb' }, boxShadow: { xs: 'none', md: 'none' }, mb: { xs: 0, md: 0 } }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563eb', letterSpacing: 0.2, fontFamily: 'Nunito, Inter, Arial, sans-serif', fontSize: { xs: '1.2rem', md: '1.35rem' }, textAlign: 'center', pb: 1, borderBottom: '2px solid #e0e7ef', mb: 2 }}>Standard Update</Typography>
                            <DialogContentText sx={{ mb: 2, color: '#64748b', fontSize: '1.08rem', fontWeight: 500, fontFamily: 'Nunito, Inter, Arial, sans-serif', textAlign: 'center' }}>
                              When you submit a new email, we&apos;ll (usually within 5-10 minutes) cross-check the domain against your management and website before confirming and making it live on the site. This helps ensure only verified management contacts are listed.
                            </DialogContentText>
                            {/* ...removed info box from Standard Update... */}
                            {/* Copy to clipboard UI */}
                            <TextField
                              label="New Community Email"
                              value={form.email}
                              InputProps={{ readOnly: true, style: { fontSize: '1.08rem', fontFamily: 'Nunito, Inter, Arial, sans-serif' } }}
                              sx={{ flex: 1, background: '#f3f4f6', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Box>
                          {/* Right column: Fast Track update */}
                          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'flex-start', background: '#f9fafb', borderRadius: { xs: 0, md: '0 0 40px 0' }, p: { xs: 4, md: 5 }, boxShadow: { xs: 'none', md: 'none' }, ml: { md: 0, xs: 0 } }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563eb', letterSpacing: 0.2, fontFamily: 'Nunito, Inter, Arial, sans-serif', fontSize: { xs: '1.2rem', md: '1.35rem' }, textAlign: 'center', pb: 1, borderBottom: '2px solid #e0e7ef', mb: 2 }}>Fast Track <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', background: '#e0e7ef', borderRadius: 8, padding: '2px 10px', marginLeft: 8 }}>Manual Review</span></Typography>
                            <Typography variant="body2" sx={{ color: '#2563eb', mb: 1, fontWeight: 600, fontFamily: 'Nunito, Inter, Arial, sans-serif', textAlign: 'center' }}>
                              Need to update your email ASAP? Use Fast Track for urgent/manual review.
                            </Typography>
                            <Box sx={{ mb: 2, p: 2.5, background: 'linear-gradient(90deg, #f1f5f9 60%, #f3f4f6 100%)', borderRadius: 3, boxShadow: '0 1px 4px 0 rgba(31,41,55,0.04)', border: 'none', textAlign: 'center' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#2563eb', fontFamily: 'Nunito, Inter, Arial, sans-serif' }}>Need it updated right away?</Typography>
                              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontFamily: 'Nunito, Inter, Arial, sans-serif', textAlign: 'center' }}>
                                {`If we can&apos;t confirm your email right away due to a domain mismatch, and your community doesn&apos;t want to wait for our automated confirmation, you can email `}
                                <span
                                  style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                  onClick={() => {
                                    navigator.clipboard.writeText('data@sparkapt.com');
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 1200);
                                  }}
                                  tabIndex={0}
                                >
                                  data@sparkapt.com
                                  <ContentCopyIcon fontSize="small" style={{ marginLeft: 4 }} />
                                </span>
                                {copied ? (
                                  <span style={{ color: '#22c55e', fontWeight: 700, marginLeft: 8 }}>Copied!</span>
                                ) : null}
                                {` directly. Our team will manually verify and update your information within a few minutes during business hours.`}
                              </Typography>
                            </Box>
                            {/* 
                            <TextField
                              autoFocus
                              margin="dense"
                              label="New Community Email"
                              type="email"
                              fullWidth
                              variant="outlined"
                              value={emailCorrection}
                              onChange={(e) => setEmailCorrection(e.target.value)}
                              sx={{ mt: 1, mb: 2, background: '#fff', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                              placeholder="your-management@domain.com"
                              InputProps={{ style: { fontSize: '1.08rem', fontFamily: 'Nunito, Inter, Arial, sans-serif' } }}
                            />
                            */}
                            {/*
                            <Button
                              onClick={async () => {
                              if (!emailCorrection || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailCorrection)) return;
                              // Update communities.json via API
                              await fetch('/api/update-community-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                community: form.community,
                                city: form.city,
                                newEmail: emailCorrection
                                })
                              });
                              setEmail(emailCorrection);
                              setForm(f => ({ ...f, email: emailCorrection }));
                              setEmailDialogOpen(false);
                              setPhase('fill');
                              }}
                              color="primary"
                              variant="contained"
                              sx={{ fontWeight: 900, boxShadow: '0 2px 8px 0 #c7d2fe', mt: 1, borderRadius: 2, fontFamily: 'Nunito, Inter, Arial, sans-serif', letterSpacing: 0.2, textTransform: 'none', fontSize: 17, py: 1.2, transition: 'box-shadow 0.2s, background 0.2s', '&:hover': { background: '#2563eb', color: '#fff' } }}
                              disabled={!emailCorrection || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailCorrection)}
                              tabIndex={0}
                            >
                              Fast Track Update
                            </Button>
                            */}
                          </Box>
                        </Box>
                      </DialogContent>
                      <DialogActions sx={{ px: 0, pb: 3, justifyContent: 'center', background: 'transparent', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
                        <Button onClick={() => setEmailDialogOpen(false)} color="secondary" sx={{ fontWeight: 800, borderRadius: 2, fontFamily: 'Nunito, Inter, Arial, sans-serif', px: 4, py: 1.3, fontSize: 17, textTransform: 'none', letterSpacing: 0.1, background: '#f3f4f6', boxShadow: 'none', '&:hover': { background: '#e5e7eb' } }}>Cancel</Button>
                      </DialogActions>
                    </Dialog>
                    <Button type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth>{isLoading ? <CircularProgress size={20} /> : 'Continue'}</Button>
                  </form>
                </>
              )}
              {/* ----- STEP 2: VERIFY ----- */}
              {phase === 'verify' && (
                <Stack spacing={2}>
                  <Typography>Enter the code sent to your email.</Typography>
                  <Button onClick={sendOtp} variant="outlined" disabled={isLoading || !email || isVerified} endIcon={isLoading ? <CircularProgress size={16} /> : null} fullWidth>{otpSent ? 'Resend Code' : 'Send Code'}</Button>
                  <TextField label="Code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ''))} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', autoComplete: 'one-time-code' }} fullWidth disabled={!otpSent || isVerified} />
                  <Button onClick={verifyOtp} variant="contained" disabled={isLoading || !otp || isVerified}>Verify</Button>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Button onClick={() => setPhase('fill')}>Back to Edit</Button>
                  </Stack>
                </Stack>
              )}
              {/* ----- STEP 3: SUMMARY / SUBMIT ----- */}
              {phase === 'summary' && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
                  <SummaryRow label="Community" value={form.community} />
                  <SummaryRow label="City" value={form.city} />
                  <SummaryRow label="Email" value={form.email} />
                  <SummaryRow label="Management Company" value={form.management} />
                  <SummaryRow label="Phone Number" value={form.phone} />
                  <SummaryRow label="Commission (Send)" value={form.commissionSend} />
                  <SummaryRow label="Commission (Escort)" value={form.commissionEscort} />
                  <SummaryRow label="Specials" value={form.specials} />
                  <SummaryRow label="Send" value={form.send} />
                  <SummaryRow label="Escort" value={form.escort} />
                  <SummaryRow label="Flat Fee" value={form.flatFee} />
                  <SummaryRow label="Notes" value={form.notes} />
                  <Stack spacing={1.5}>
                    <Button variant="contained" color="primary" fullWidth disabled={isLoading || !isVerified} onClick={submitToSheets}>{isLoading ? <CircularProgress size={20} /> : 'Submit to SparkAPT'}</Button>
                    <Button variant="text" color="secondary" fullWidth onClick={() => setPhase('fill')}>Back to Edit</Button>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
      {/* Confirmation Modal (fragment sibling) */}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, textAlign: 'center', mt: 2, mb: 1, letterSpacing: 1, color: '#1a202c', fontFamily: 'Nunito, Arial, sans-serif', p: 0, width: '100%' }} component="div">We're on it</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: 18, md: 20 }, textAlign: 'center', fontWeight: 500, fontFamily: 'Nunito, Arial, sans-serif', mt: 1, mb: 2 }}>You'll receive an email once your new community email is confirmed. Thanks for helping us keep our data accurate!</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setConfirmationOpen(false)} color="primary" variant="contained" sx={{ fontWeight: 600, px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }