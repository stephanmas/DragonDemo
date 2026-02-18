import { motion } from "framer-motion";
import iconFlights from "../assets/Icon_Flights.png";
import iconHotels from "../assets/Icon_Hotels.png";
import iconTransfer from "../assets/Icon_Transfer.png";
import iconOffers from "../assets/Icon_Offers.png";
import iconLounge from "../assets/Icon_Lounge.png";
import iconDinning from "../assets/Icon_Dinning.png";
import iconFitness from "../assets/Icon_Fitness.png";
import iconFastrack from "../assets/Icon_Fastrack.png";
import iconEsim from "../assets/Icon_eSIM.png";
import iconTripPlanner from "../assets/Icon_TripPlanner.png";

const SERVICES = [
  { id: "flights", label: "Flights", icon: iconFlights },
  { id: "hotels", label: "Hotels", icon: iconHotels },
  { id: "transfers", label: "Transfers", icon: iconTransfer },
  { id: "offers", label: "Offers", icon: iconOffers },
  { id: "lounge", label: "Lounge", icon: iconLounge },
  { id: "dining", label: "Dining", icon: iconDinning },
  { id: "fitness", label: "Fitness", icon: iconFitness },
  { id: "fasttrack", label: "FastTrack", icon: iconFastrack },
  { id: "esim", label: "eSIM", icon: iconEsim },
  { id: "trip", label: "Trip Planner", icon: iconTripPlanner },
];

interface ServiceCardProps {
  service: (typeof SERVICES)[0];
  index: number;
  onClick?: () => void;
}

export function ServiceCard({ service, index, onClick }: ServiceCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flex: 1,
        minWidth: 0,
        padding: "16px 12px",
        background: "#FFFFFF",
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        height: 84,
      }}
    >
      <img src={service.icon} alt="" width={24} height={24} style={{ objectFit: "contain" }} />
      <span
        style={{
          fontSize: "var(--font-size-xs)",
          fontWeight: 500,
          color: "var(--color-text)",
          textAlign: "center",
        }}
      >
        {service.label}
      </span>
    </motion.button>
  );
}

export { SERVICES };
