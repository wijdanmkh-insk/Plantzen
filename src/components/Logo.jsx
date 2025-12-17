import defaultLogo from "../../public/logo.png";

export default function Logo({ src }) {
  return (
    <div className="px-4 py-2 flex items-center justify-center">
      <img
        src={src || defaultLogo}
        alt="Plantzen Logo"
        className="w-64 h-auto rounded-full object-cover"
      />
    </div>
  );
}
