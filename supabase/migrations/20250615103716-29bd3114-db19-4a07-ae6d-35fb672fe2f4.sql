
-- Add a `downvotes` column to the posts table, defaulting to 0
ALTER TABLE public.posts
ADD COLUMN downvotes integer NOT NULL DEFAULT 0;

-- Optionally backfill `downvotes` values for existing posts (already set by default above)

-- Insert 10 wild fake Nigerian stories with initial votes
INSERT INTO public.posts (title, content, votes, downvotes)
VALUES
  (
    'I Registered My Car With a Goat',
    'At the licensing office, they told me the computer was down and my goat could complete the registration for me. Two hours and three yams later, my goat has its own plate number. Only in Nigeria.',
    11, 0
  ),
  (
    'The ATM That Dispensed Snacks',
    'Waiting for cash at an ATM in Lagos, the machine coughed out gala and a bottle of LaCasera instead of naira notes. Security guard said, "At least it no swallow your card."',
    17, 2
  ),
  (
    'I Paid for 24-Hour Light, Got Candle Instead',
    'Paid NEPA for a special "all day power" promo and received a branded candle with NEPA logo as "backup." The official winked and said, "E better pass our usual supply."',
    20, 1
  ),
  (
    'Exam Malpractice By Drone',
    'My school’s exam hall was invaded by a drone dropping expo answer sheets. Invigilator simply said "E go explain itself to WAEC."',
    24, 4
  ),
  (
    'POS Gave Change in Recharge Cards',
    'Bought suya and wanted to pay by POS, but since network was down, I got my change in MTN recharge cards and one seat at the owner’s wedding.',
    13, 0
  ),
  (
    'Used Pure Water to Fuel My Car',
    'Fuel attendant in Owerri poured pure water in my tank because "better than air." My car still thanks me with prayer every Sunday.',
    10, 3
  ),
  (
    'Minister Punctual for Meeting… By Accident',
    'The Minister arrived early for a 10AM meeting. Turns out she was lost and thought she was at the airport.',
    16, 1
  ),
  (
    'Snake Swallowed My Exam Scripts',
    'Principal announced that WAEC scripts were missing. Later told us a snake swallowed them during prayer meeting. "Let us pray," he said.',
    28, 2
  ),
  (
    'Lunch With Dangote – Paid In Exposure',
    'Was told I won "Lunch With Dangote." Got there, it was jollof rice and a selfie, then someone handed me a certificate: "Paid In Exposure."',
    12, 0
  ),
  (
    'Police Officer Offered Me Wi-Fi',
    'Stopped at a checkpoint. Officer said, "Pay for pass, or use our Wi-Fi." Turns out their Wi-Fi was his Bluetooth hotspot called "I-See-You." Only in Nigeria.',
    15, 1
  );
