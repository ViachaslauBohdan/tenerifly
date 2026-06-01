export default function WorldToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

/*
const OTPUSK_FORM_CSS = "https://export.otpusk.com/os/onsite/form.css";
const OTPUSK_RESULT_CSS = "https://export.otpusk.com/os/onsite/result.css";
const OTPUSK_TOUR_CSS = "https://export.otpusk.com/os/onsite/tour.css";

export default function WorldToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preload" href={OTPUSK_FORM_CSS} as="style" />
      <link rel="stylesheet" href={OTPUSK_FORM_CSS} precedence="high" />
      <link rel="stylesheet" href={OTPUSK_RESULT_CSS} precedence="default" />
      <link rel="stylesheet" href={OTPUSK_TOUR_CSS} precedence="default" />
      {children}
    </>
  );
}
*/
