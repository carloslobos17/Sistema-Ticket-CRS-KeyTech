import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function TicketRatingModal({ isOpen, onClose, ticket, onNext }) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComentario("");
    }
  }, [isOpen, ticket]);

  if (!isOpen || !ticket) return null;

  const fecha = ticket?.created_at
    ? new Date(ticket.created_at).toLocaleDateString("es-ES")
    : "N/A";

  const handleEnviar = () => {
    Swal.fire({
      icon: "success",
      title: "Calificación enviada",
      text: "La calificación se registró correctamente.",
      confirmButtonColor: "#16a34a",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      onNext();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-red-600 text-white text-center py-3">
          <h1 className="text-lg font-bold">Cruz Roja — Centro de Soporte</h1>
          <p className="text-xs">Sistema de Tickets de Ayuda Técnica</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Info del ticket */}
          <div className="border rounded-md p-3 bg-gray-50">
            <h2 className="font-semibold mb-2 text-sm">Información del Ticket</h2>
            <div className="grid grid-cols-2 text-xs gap-y-1">
              <p><strong>Ticket:</strong> #{ticket?.ticket?.code}</p>
              <p><strong>Departamento:</strong> {ticket?.ticket?.department?.name ?? "N/A"}</p>
              <p><strong>Problema:</strong> {ticket?.ticket?.subject ?? "N/A"}</p>
              <p><strong>Estado:</strong> Resuelto</p>
              <p><strong>Técnico:</strong> {ticket?.user?.name ?? "N/A"}</p>
              <p><strong>Fecha:</strong> {fecha}</p>
            </div>
          </div>

          {/* Calificación */}
          <div className="border rounded-md p-3">
            <h2 className="text-sm font-semibold">Calificación de la Resolución</h2>
            <p className="text-gray-500 text-xs mb-2">Califique el servicio recibido</p>

            <div className="flex items-center gap-1 text-2xl mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition ${
                    star <= rating
                      ? "text-yellow-400 scale-110"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-sm ml-2 font-semibold">{rating}/5</span>
            </div>

            <h3 className={`font-semibold text-sm ${rating > 3 ? "text-green-700" : "text-red-700"}`}>
              Comentario
            </h3>
            <p className={`text-xs mb-2 ${rating > 3 ? "text-green-600" : "text-orange-600"}`}>
              Explica tu calificación para ayudarnos a mejorar
            </p>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className={`w-full border rounded-md p-2 h-24 text-sm resize-none focus:outline-none focus:ring-2 ${
                rating > 3 ? "focus:ring-green-400" : "focus:ring-red-400"
              }`}
              placeholder="Escribe tu comentario..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-2">
            <button
              onClick={handleEnviar}
              disabled={rating === 0 || comentario.trim() === ""}
              className={`px-4 py-2 text-sm rounded-md w-40 text-white ${
                rating === 0 || comentario.trim() === ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Enviar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md w-40 border"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}