import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { MdEdit, MdDelete } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoMdDocument } from "react-icons/io";
import { useConfirmStore } from "../../../storage/confim.storage";
import { useDeleteConsult } from "../../Files/query/consult.query";
import { useQueryClient } from "@tanstack/react-query";
import { IConsult } from "../../../../interfaces/consult.interface";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { useConsutlFormStore } from "../../../storage/form.storage";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument, rgb, PDFPage } from "pdf-lib";
import { saveAs } from "file-saver";
import img from "../../Customer/receta medica.jpg";

interface IProps {
  id: string;
}

export function ActionConsult({ id }: IProps) {
  const { mutate: handleDeleteConsult, status: statusDelete } =
    useDeleteConsult();
  const { patientId } = useParams();
  const showConfirm = useConfirmStore((state) => state.showConfirm);
  const clientQuery = useQueryClient();
  const { toggleForm, setItem, setModeForm } = useConsutlFormStore();

  const handleUpdate = () => {
    const consult = (
      clientQuery.getQueryData<IConsult[]>([
        "getConsultByPatientId",
        patientId,
      ]) ?? []
    ).find((param) => param.id === id);

    console.log("el id es: " + id);

    if (!consult) return;

    setItem(consult);
    setModeForm(MODEFORMENUM.UPDATE);
    toggleForm();
  };

  const handleDelete = () => {
    showConfirm("Eliminar", "¿Desea eliminar el consulta?", () => {
      handleDeleteConsult(id);
    });
  };

  const handleGeneratePDF = () => {
    // Obtener los datos de la consulta
    const consult = (
      clientQuery.getQueryData<IConsult[]>([
        "getConsultByPatientId",
        patientId,
      ]) ?? []
    ).find((param) => param.id === id);

    if (!consult) {
      alert("No se encontró la consulta.");
      return;
    }

    console.log("Consult Data:", consult);
    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // const pageWidth = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página
    // const text = "Consulta médica";
    // const textWidth = doc.getTextWidth(text); // Obtiene el ancho del texto

    // // Configurar fuente en negrita
    // doc.setFont("helvetica", "bold");

    // // Escribir texto centrado
    // doc.text(text, (pageWidth - textWidth) / 2, 20);

    // doc.addImage(
    //   "https://dl.dropboxusercontent.com/scl/fi/1dkv94n2vwvnjmpd03yj8/e2ed39fa-ed26-44c4-955d-11ce1231afc8.jpeg?rlkey=syzmyq0gi6fbc90oy5ttrx2qt&dl=0",
    //   "JPEG", // Formato de la imagen
    //   10, // Posición X
    //   10, // Posición Y
    //   10, // Ancho
    //   10 // Alto
    // );

    // // Agregar los textos
    // doc.setFontSize(6); // Establecer tamaño de fuente pequeño
    // doc.text("Hola", 20, 15); // Texto "Hola" al lado de la imagen
    // doc.text("Adios", 20, 20); // Texto "Adios" debajo de "Hola"
    // doc.text("xdxdxdxd", 20, 25); // Texto "xdxdxdxd" debajo de "Adios"
    const clinicaData = localStorage.getItem("clinicaData");
    if (clinicaData) {
      // Convierte el string a un objeto si la data fue almacenada como JSON
      const parsedData = JSON.parse(clinicaData);
      console.log(parsedData);
      doc.addImage(
        parsedData.imagen, // Ruta de la imagen o URL de la imagen en lise,
        "JPEG", // Formato de la imagen
        0, // Posición X
        0, // Posición Y
        50, // Ancho
        50 // Alto
      );
      // // Agregar los textos

      doc.setFont("helvetica", "bold");
      doc.text(`Clinica ${parsedData.nombre}`, 42, 15);
      doc.setFontSize(9);
      doc.text(`COD Clínica: ${parsedData.codigo}`, 150, 15);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Direccion:", 42, 21);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text(parsedData.direccion, 70, 21);
      const texto =
        "Atención personalizada para el diagnóstico, tratamiento y seguimiento de enfermedades comunes, infecciones, dolencias y problemas de salud generales.";

      const maxCaracteresPorLinea = 60; // Máximo de caracteres antes del salto
      const lineas = []; // Array para almacenar las líneas

      // Dividir el texto en partes de máximo 52 caracteres
      for (let i = 0; i < texto.length; i += maxCaracteresPorLinea) {
        lineas.push(texto.substring(i, i + maxCaracteresPorLinea).trim());
      }

      // Imprimir cada línea en una posición diferente en Y
      let y = 27; // Posición inicial en el eje Y
      lineas.forEach((linea) => {
        doc.setFontSize(14);
        doc.text(linea, 42, y);
        y += 6; // Incrementar Y para la siguiente línea
      });
      // doc.setFont("helvetica", "bold"); // Poner en negrita
      // doc.text("Teléfono:", 15, 290);
      // doc.setFont("helvetica", "normal"); // Volver a fuente normal
      // doc.text(parsedData.telefono, 40, 290); // Ajustar la posición para que quede al lado

      // doc.setFont("helvetica", "bold"); // Poner en negrita
      // doc.text("Horario Atención:", 110, 290);
      // doc.setFont("helvetica", "normal"); // Volver a fuente normal
      // doc.text(parsedData.horario, 160, 290); // Ajustar la posición para que quede alineado
    } else {
      console.log("No se encontró información en localStorage");
    }

    // Eliminar letras y símbolos, quedándonos solo con los números
    let numbersOnly = consult.id.replace(/[^0-9]/g, ""); // Elimina todo lo que no sea un número

    // Obtener solo los primeros 6 números
    let firstSixNumbers = numbersOnly.substring(0, 6);

    doc.setFont("helvetica", "bold"); // Poner en negrita
    doc.text(`Código Consulta: ${firstSixNumbers}`, 15, 63);
    doc.setFont("helvetica", "normal"); // Poner en negrita
    // Saltos de línea
    let currentY = 65; // Comienza en y = 30 después del encabezado

    autoTable(doc, {
      startY: currentY, // Comienza la tabla después de los saltos de línea
      body: [
        [
          {
            content: "Consulta Médica",
            styles: {
              fontStyle: "bold",
              fontSize: 14,
              fillColor: [0, 76, 153],
              lineColor: [0, 0, 0],
              textColor: [255, 255, 255],
              halign: "center",
            },
            colSpan: 4,
          },
        ],
        [
          {
            content: "Nombre del paciente:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
          {
            content: "Fecha consulta:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
        ],
        [
          {
            content: consult.patient?.name || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: new Date(consult.createdAt).toLocaleDateString() || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
        // Segunda fila que se ve como encabezado
        [
          {
            content: "Motivo:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 1,
          },
          {
            content: "Peso:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 1,
          },
          {
            content: "Tamaño:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 1,
          },
          {
            content: "Pulso",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 1,
          },
        ],
        [
          {
            content: consult.motive || "N/A",
            colSpan: 1,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consult.weight ? `${consult.weight} kg` : "N/A",
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
            colSpan: 1,
          },
          {
            content: consult.size ? `${consult.size} cm` : "N/A",
            colSpan: 1,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consult.pulse ? `${consult.pulse} Lpm` : "N/A",
            colSpan: 1,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Historial clínico:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 1,
          },
          {
            content: "Saturacion de Oxígeno:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 1,
          },
          {
            content: "Presión Arterial:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
        ],
        [
          {
            content: consult.clinicalhistory || "N/A",
            colSpan: 1,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consult.oxygenSaturation
              ? `${consult.oxygenSaturation}%`
              : "N/A",
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
            colSpan: 1,
          },
          {
            content:
              consult.systolicPressure && consult.diastolicPressure
                ? `${consult.systolicPressure}/${consult.diastolicPressure} mmHg`
                : "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
      theme: "grid",
    });

    // Obtener la posición actual después de la primera tabla
    // const finalY = (doc as any).lastAutoTable?.finalY || 10; // Espaciado de 10 unidades

    // // Encabezado de Evaluación Geriátrica
    // const textt = "Evaluación Geriátrica";
    // const textWidthh = doc.getTextWidth(textt); // Corrige la variable usada
    // const pageWidthh = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página

    // doc.setFont("helvetica", "bold");
    // doc.text(textt, (pageWidthh - textWidthh) / 2, finalY + 10); // Coloca el texto debajo de la primera tabla

    // Segunda tabla (Evaluación Geriátrica)

    autoTable(doc, {
      // startY: finalY + 20,
      body: [
        [
          {
            content: "Evaluación Geriátrica",
            styles: {
              fontStyle: "bold",
              fontSize: 14,
              fillColor: [0, 76, 153],
              lineColor: [0, 0, 0],
              textColor: [255, 255, 255],
              halign: "center",
            },
            colSpan: 4,
          },
        ],
        [
          {
            content: "Evaluacion Biologica",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
          {
            content: "Evalucaion Psicologica:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
        ],
        [
          {
            content: consult.bilogicalEvaluation || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consult.psychologicalEvaluation || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Evaluacion Social",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
          {
            content: "Evaluacion Funcional:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
        ],
        [
          {
            content: consult.socialEvaluation || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consult.functionalEvaluation || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
      theme: "grid",
    });

    // const finalY2 = (doc as any).lastAutoTable?.finalY || finalY + 10;
    // const textResultados = "Resultados y Diagnósticos";
    // const textWidthResultados = doc.getTextWidth(textResultados);

    // doc.setFont("helvetica", "bold");
    // doc.text(
    //   textResultados,
    //   (pageWidth - textWidthResultados) / 2,
    //   finalY2 + 10
    // );

    autoTable(doc, {
      // startY: finalY2 + 20,
      body: [
        [
          {
            content: "Resultados y Diagnósticoss",
            styles: {
              fontStyle: "bold",
              fontSize: 14,
              fillColor: [0, 76, 153],
              lineColor: [0, 0, 0],
              textColor: [255, 255, 255],
              halign: "center",
            },
            colSpan: 4,
          },
        ],
        [
          {
            content: "Examen Complementario:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
          {
            content: consult.complementaryTest?.name || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Diagnostico:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
          {
            content: "Receta:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
        ],
        [
          {
            content: consult.diagnosis || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consult.recipe || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Registrado por:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
          {
            content: "Proxima Cita:",
            styles: {
              fontStyle: "bold",
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
            colSpan: 2,
          },
        ],
        [
          {
            content: consult.userCreatedBy?.name || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: formateDate(consult.nextappointment) || "N/A",
            colSpan: 2,
            styles: {
              lineColor: [0, 0, 0],
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
      theme: "grid",
    });
    const finalY = (doc as any).lastAutoTable?.finalY || 10; // Espaciado de 10 unidades

    // Encabezado de Evaluación Geriátrica
    const textt = "___________________";
    const textWidthh = doc.getTextWidth(textt); // Corrige la variable usada
    const pageWidthh = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página

    doc.setFont("helvetica", "bold");
    doc.text(textt, (pageWidthh - textWidthh) / 2, finalY + 10); // Coloca el texto debajo de la primera tabla
    const texttt = "Firma Médico";
    const textWidthhh = doc.getTextWidth(textt); // Corrige la variable usada
    const pageWidthhh = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página

    doc.setFont("helvetica", "bold");
    // Nueva posición más a la derecha
    const offsetX = 10; // Ajusta este valor según lo que necesites
    doc.text(texttt, (pageWidthhh - textWidthhh) / 2 + offsetX, finalY + 18);

    if (consult.image) {
      if (consult.image.originalUrl) {
        doc.addPage();
        doc.addImage(consult.image.originalUrl, 10, 30, 190, 200);
      }
    }

    // Guardar el PDF con el nombre del paciente o un nombre genérico si es null
    const fileName = consult.patient?.name
      ? `Consulta_Medica_${consult.patient.name}_${
          consult.createdAt.split("T")[0]
        }.pdf`
      : "Consulta_Medica.pdf";

    // Guardar el archivo
    doc.save(fileName);
  };

  const formateDate = (date: string) => {
    let dateString = date || "N/A"; // Si no existe el valor, se usará "N/A"

    if (dateString !== "N/A") {
      // Reemplazar "T" por espacio y eliminar la "Z"
      dateString = dateString.replace("T", " ").replace("Z", "");

      // Dividir la fecha en parte de fecha y hora
      let [datePart, timePart] = dateString.split(" ");

      // Extraer la hora, los minutos y los segundos
      let [hours, minutes, seconds] = timePart.split(":").map(Number);

      // Restar 6 horas
      hours -= 6;

      // Si las horas quedan por debajo de 0 (es decir, resta de un día anterior), ajustamos
      if (hours < 0) {
        hours += 24; // Sumar 24 horas si queda negativo
        // Ajustar el día, para eso usamos el objeto Date
        let date = new Date(datePart); // Crear un objeto Date solo con la parte de la fecha
        date.setDate(date.getDate() - 1); // Restamos un día
        datePart = date.toISOString().split("T")[0]; // Formateamos solo la fecha (YYYY-MM-DD)
      }

      // Formatear la nueva hora con los minutos y segundos
      let newTimePart = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      // Crear la nueva fecha con la hora ajustada
      var formattedDate = `${datePart} ${newTimePart}`;
      return formattedDate;

      // Mostrar el resultado en el documento
    }
  };

  const handleGenerateRecipePDF = async () => {
    // Obtener los datos de la consulta
    const consult = (
      clientQuery.getQueryData<IConsult[]>([
        "getConsultByPatientId",
        patientId,
      ]) ?? []
    ).find((param) => param.id === id);

    if (!consult) {
      alert("No se encontró la consulta.");
      return;
    }

    console.log("Consult Data:", consult);

    const doc = new jsPDF();

    // Cargar la imagen (en este caso, la imagen se carga desde una URL)
    const imgPath = img; // Cambia esto por la ruta de tu imagen

    // Agregar la imagen al PDF como fondo (ajustar al tamaño de la página)
    doc.addImage(
      imgPath,
      "JPEG",
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height
    );

    // Ahora puedes agregar más contenido encima de la imagen, por ejemplo, texto:
    doc.setFontSize(12);
    doc.text(consult.patient?.name || "N/A", 60, 60);
    doc.text(consult.createdAt.split("T")[0] || "N/A", 155, 60);
    doc.text(
      calculateAge(consult.patient?.birthday || "N/A").toString(),
      40,
      72
    );
    doc.text(
      consult.patient?.typeSex === "c2594acf-bb7c-49d0-9506-f556179670ab"
        ? "Femenino"
        : "Masculino",
      94,
      72
    );
    doc.text(consult.weight ? `${consult.weight} kg` : "N/A", 160, 72);
    doc.text(consult.diagnosis || "N/A", 50, 84);
    // const texto = consult.recipe || "N/A";
    // const maxCaracteresPorLinea = 70; // Máximo de caracteres antes del salto
    // const lineas = []; // Array para almacenar las líneas

    // // Dividir el texto en partes de máximo 80 caracteres
    // for (let i = 0; i < texto.length; i += maxCaracteresPorLinea) {
    //   lineas.push(texto.substring(i, i + maxCaracteresPorLinea).trim());
    // }

    // // Imprimir cada línea en una posición diferente en Y
    // let y = 110; // Posición inicial en el eje Y
    // lineas.forEach((linea) => {
    //   doc.text(linea, 20, y);
    //   y += 8; // Incrementar Y para la siguiente línea
    // });

    const texto: string = consult.recipe || "N/A";
    const maxCaracteresPorLinea: number = 70; // Máximo de caracteres antes del salto de línea
    const lineas: string[] = []; // Especificamos que es un array de strings
    const yInicial: number = 110; // Posición inicial en Y
    let y: number = yInicial;

    // Primero, dividir por saltos de línea existentes (\n)
    const partes: string[] = texto.split("\n");

    partes.forEach((parte: string) => {
      // Dividir cada parte en fragmentos de máximo 'maxCaracteresPorLinea' caracteres
      for (let i = 0; i < parte.length; i += maxCaracteresPorLinea) {
        lineas.push(parte.substring(i, i + maxCaracteresPorLinea).trim());
      }
      // Agregar un espacio extra en Y para respetar los saltos de línea originales
      lineas.push("");
    });

    // Imprimir cada línea en una posición diferente en Y
    lineas.forEach((linea: string) => {
      doc.text(linea, 20, y);
      y += 4; // Espacio normal entre líneas
    });

    doc.text(consult.userCreatedBy?.name || "N/A", 145, 270);
    doc.text(formateDate(consult.nextappointment) || "N/A", 27, 257);

    let numbersOnly = consult.id.replace(/[^0-9]/g, ""); // Elimina todo lo que no sea un número

    // Obtener solo los primeros 6 números
    let firstSixNumbers = numbersOnly.substring(6, 12);

    doc.setFont("helvetica", "bold"); // Poner en negrita
    doc.text(`Código Receta: ${firstSixNumbers}`, 1, 296);
    doc.setFont("helvetica", "normal"); // Poner en negrita

    const clinicaData = localStorage.getItem("clinicaData");
    if (clinicaData) {
      // Convierte el string a un objeto si la data fue almacenada como JSON
      const parsedData = JSON.parse(clinicaData);
      console.log(parsedData);
      doc.addImage(
        parsedData.imagen, // Ruta de la imagen o URL de la imagen en lise,
        "JPEG", // Formato de la imagen
        0, // Posición X
        3, // Posición Y
        13, // Ancho
        13 // Altos
      );
      // // Agregar los textos

      doc.setFont("helvetica", "bold");
      doc.text(`Clinica ${parsedData.nombre}`, 80, 15);
      doc.setFont("helvetica", "normal");

      doc.setFont("helvetica", "bold");
      doc.text(parsedData.direccion, 67, 21);
      doc.setFont("helvetica", "normal");

      doc.setFont("helvetica", "bold"); // Poner en negrita
      doc.text(parsedData.telefono, 90, 295); // Ajustar la posición para que quede al lado
      doc.setFont("helvetica", "normal");

      doc.setFont("helvetica", "bold"); // Poner en negrita
      doc.text("Horario Atención:", 70, 27);
      doc.setFont("helvetica", "normal"); // Volver a fuente normal
      doc.text(parsedData.horario, 106, 27); // Ajustar la posición para que quede alineado
    } else {
      console.log(
        "Primero ingrese inofrmacion de la clinica en seccion Configuraciones"
      );
    }
    const filesName = consult.patient?.name
      ? `Receta_Medica_${consult.patient?.name}.pdf`
      : "Receta_Medica.pdf";

    // Guardar el archivo
    doc.save(filesName);
  };

  /**
   * Divide el texto en líneas según un ancho máximo de caracteres.
   */
  function splitTextIntoLines(text: string, maxLength: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    }

    if (currentLine.trim().length > 0) {
      lines.push(currentLine.trim());
    }

    return lines;
  }

  /**
   * Dibuja texto con saltos de línea en una página PDF.
   */
  function drawWrappedText(
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    lineHeight: number
  ) {
    const maxWidth = 50; // Define el ancho máximo en caracteres antes de hacer un salto de línea
    const lines = splitTextIntoLines(text, maxWidth);
    let currentY = y;

    for (const line of lines) {
      page.drawText(line, {
        x,
        y: currentY,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight; // Mueve hacia abajo la posición del texto
    }
  }

  const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday); // Convierte la fecha de string a Date
    const today = new Date(); // Fecha actual

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Ajusta la edad si el cumpleaños aún no ha ocurrido este año
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const isLoading = statusDelete === "pending";

  return (
    <div className="flex flex-row gap-2 items-center justify-center h-full w-full">
      <Dropdown backdrop="blur" className="rounded-md">
        <DropdownTrigger>
          <Button isLoading={isLoading} size="sm" isIconOnly variant="light">
            <FaEllipsisVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            startContent={<HiOutlineClipboardDocumentList />}
            key="recipe"
            onPress={handleGenerateRecipePDF}
          >
            Generar Receta
          </DropdownItem>
          <DropdownItem
            startContent={<IoMdDocument />}
            key="generate"
            onPress={handleGeneratePDF}
          >
            Generar Consulta
          </DropdownItem>
          <DropdownItem
            onPress={handleUpdate}
            showDivider
            startContent={<MdEdit />}
            key="edit"
          >
            Editar
          </DropdownItem>
          <DropdownItem
            className="text-danger"
            color="danger"
            key="delete"
            startContent={<MdDelete />}
            onPress={handleDelete}
          >
            Eliminar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
