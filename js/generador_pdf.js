document.addEventListener('DOMContentLoaded', function() {
    const nombreClienteInput = document.getElementById('nombre_cliente');
    const tiendaInput = document.getElementById('tienda'); // Asegúrate de tener un input con este ID en tu HTML
    const osiptelCaptureInput = document.getElementById('osiptel_capture');
    const transferenciaOsiptelInput = document.getElementById('transferencia_osiptel');
    const fotoImeiFisicoInput = document.getElementById('foto_imei_fisico');
    const fotoImeiLogicoInput = document.getElementById('foto_imei_logico');
    const solicitudAbonadoInput = document.getElementById('solicitud_abonado');
    const validacionIdentidadInput = document.getElementById('validacion_identidad');
    const capturaGsmaInput = document.getElementById('captura_gsma');
    const exportarPdfButton = document.getElementById('exportar_pdf');
    const mensajeExportacionDiv = document.getElementById('mensaje_exportacion');

    async function embedFile(pdfDoc, file, headerText) {
        return new Promise(async (resolve, reject) => {
            if (!file) {
                resolve();
                return;
            }
            try {
                const bytes = new Uint8Array(await file.arrayBuffer());

                if (file.type === 'application/pdf') {
                    const pdf = await PDFLib.PDFDocument.load(bytes);
                    const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach(copiedPage => {
                        pdfDoc.addPage(copiedPage);
                        // Si es un PDF, no se añade el encabezado aquí, se asume que ya lo tiene.
                        // Tampoco se ajusta el tamaño de la página del PDF subido desde aquí.
                    });
                    resolve();
                } else if (file.type.startsWith('image/')) {
                    let image;
                    if (file.type === 'image/png') {
                        image = await pdfDoc.embedPng(bytes);
                    } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                        image = await pdfDoc.embedJpg(bytes);
                    }

                    if (image) {
                        const page = pdfDoc.addPage();
                        const { width: originalWidth, height: originalHeight } = image;
                        const pageWidth = page.getWidth();
                        const pageHeight = page.getHeight();
                        const headerFontSize = 18;
                        const imageWidth = 400; // Tamaño A4 aproximado para el ancho
                        const imageHeight = (imageWidth / originalWidth) * originalHeight; // Mantener proporción
                        const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
                        const headerTextWidth = helveticaBoldFont.widthOfTextAtSize(headerText, headerFontSize);
                        const headerX = (pageWidth - headerTextWidth) / 2;
                        const headerY = pageHeight - 70; // Ajustar margen superior

                        page.drawText(headerText, {
                            x: headerX,
                            y: headerY,
                            font: helveticaBoldFont,
                            size: headerFontSize,
                        });

                        page.drawImage(image, {
                            x: (pageWidth - imageWidth) / 2,
                            y: headerY - imageHeight - 20, // Ajustar espacio entre encabezado e imagen
                            width: imageWidth,
                            height: imageHeight,
                        });
                    }
                    resolve();
                } else {
                    resolve(); // Si el tipo de archivo no es PDF ni imagen, simplemente resolvemos.
                }
            } catch (error) {
                console.error('Error embedding file:', error);
                reject(error);
            }
        });
    }

    exportarPdfButton.addEventListener('click', async function() {
        mensajeExportacionDiv.textContent = 'Estamos Trabjando en Realizar tu PDF...';
        const nombreCliente = nombreClienteInput.value.trim();
        const tienda = tiendaInput?.value.trim() || '';
        if (!nombreCliente) {
            alert('Por favor, ingresa el nombre del cliente.');
            mensajeExportacionDiv.textContent = '';
            return;
        }

        const pdfDoc = await PDFLib.PDFDocument.create();
        const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
        const firstPage = pdfDoc.addPage();
        const pageWidth = firstPage.getWidth();
        const pageHeight = firstPage.getHeight();
        const mainTitleFontSize = 24;
        const subTitleFontSize = 16;
        const textColor = PDFLib.rgb(0, 0, 0);
        const margin = 50;

        const mainTitleText = 'REPORTE DE IMEI CLONADO / DUPLICADO';
        const clientText = `NOMBRE DEL CLIENTE: ${nombreCliente}`;
        const tiendaText = `TIENDA: ${tienda}`;


        const mainTitleWidth = helveticaBoldFont.widthOfTextAtSize(mainTitleText, mainTitleFontSize);
        const clientTextWidth = helveticaFont.widthOfTextAtSize(clientText, subTitleFontSize);
        const tiendaTextWidth = helveticaFont.widthOfTextAtSize(tiendaText, subTitleFontSize);

        const totalTextHeight = (mainTitleFontSize + subTitleFontSize + subTitleFontSize) + 20;
        const startY = (pageHeight - totalTextHeight) / 2 + totalTextHeight;

        // Draw main title
        firstPage.drawText(mainTitleText, {
            x: (pageWidth - mainTitleWidth) / 2,
            y: startY - mainTitleFontSize - 10,
            size: mainTitleFontSize,
            font: helveticaBoldFont,
            color: textColor,
        });

        // Draw client name
        firstPage.drawText(clientText, {
            x: (pageWidth - clientTextWidth) / 2,
            y: startY - mainTitleFontSize - 10 - subTitleFontSize - 5,
            size: subTitleFontSize,
            font: helveticaFont,
            color: textColor,
        });

        // Draw tienda name
        firstPage.drawText(tiendaText, {
            x: (pageWidth - tiendaTextWidth) / 2,
            y: startY - mainTitleFontSize - 10 - subTitleFontSize - 5 - subTitleFontSize - 5,
            size: subTitleFontSize,
            font: helveticaFont,
            color: textColor,
        });

        try {
            // Segunda página y siguientes para los archivos
            const files = [
                { file: osiptelCaptureInput.files[0], header: '1. CAPTURA DE PÁGINA DE OSIPTEL:' },
                { file: transferenciaOsiptelInput.files[0], header: '2. CAPTURA DE TRANSFERENCIA A OSIPTEL:' },
                { file: fotoImeiFisicoInput.files[0], header: '3. FOTO IMEI FÍSICO:' },
                { file: fotoImeiLogicoInput.files[0], header: '4. FOTO IMEI LÓGICO:' },
                { file: solicitudAbonadoInput.files[0], header: '5. SOLICITUD DE CUESTIONAMIENTO PRESENTADO POR EL ABONADO:' },
                { file: validacionIdentidadInput.files[0], header: '6. VALIDACIÓN DE IDENTIDAD:' },
                { file: capturaGsmaInput.files[0], header: '7. CAPTURA GSMA:' }
            ];

            for (const item of files) {
                await embedFile(pdfDoc, item.file, item.header);
            }

            const pdfBytes = await pdfDoc.save();
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'Reporte_IMEI_Clonado.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            mensajeExportacionDiv.textContent = 'Tu Archivo esta Listo y Descargado';

        } catch (error) {
            console.error('Error durante la generación del PDF:', error);
            mensajeExportacionDiv.textContent = 'Error al generar el PDF.';
        }
    });
});