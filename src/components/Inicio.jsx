import { useState, useEffect } from "react";
import "./Inicio.css";

export default function Inicio({ onLoginClick, onRegisterClick }) {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="inicio-container">
      {/* Título de la App */}
      <h1 className="titulo-app">DoItNow</h1>

      {/* Reloj */}
      <div className="reloj">
        <h2>{hora.toLocaleTimeString()}</h2>
        <p>{`${diasSemana[hora.getDay()]}, ${hora.getDate()} de ${meses[hora.getMonth()]}`}</p>
      </div>

      {/* Botones */}
      <div className="botones-inicio">
        <button className="btn-inicio" onClick={onLoginClick}>Iniciar Sesión</button>
        <button className="btn-registro" onClick={onRegisterClick}>Registrarse</button>
      </div>
    </div>
  );
}
