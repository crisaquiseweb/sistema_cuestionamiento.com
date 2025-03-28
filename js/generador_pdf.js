document.addEventListener('DOMContentLoaded', function() {
    const nombreClienteInput = document.getElementById('nombre_cliente');
    const osiptelCaptureInput = document.getElementById('osiptel_capture');
    const transferenciaOsiptelInput = document.getElementById('transferencia_osiptel');
    const fotoImeiFisicoInput = document.getElementById('foto_imei_fisico');
    const fotoImeiLogicoInput = document.getElementById('foto_imei_logico');
    const solicitudAbonadoInput = document.getElementById('solicitud_abonado');
    const validacionIdentidadInput = document.getElementById('validacion_identidad');
    const capturaGsmaInput = document.getElementById('captura_gsma');
    const exportarPdfButton = document.getElementById('exportar_pdf');
    const mensajeExportacionDiv = document.getElementById('mensaje_exportacion');

    async function embedFile(pdfDoc, file, originalFilename) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve();
                return;
            }
            const reader = new FileReader();
            reader.onload = async function(event) {
                try {
                    const bytes = new Uint8Array(event.target.result);
                    const filenameText = originalFilename || 'Encabezado';
                    const filenameFontSize = 10;
                    const textX = 50;
                    const textY = 30; // Near the bottom of the page
                    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
                    const textColor = PDFLib.rgb(0, 0, 0);

                    console.log(`Embedding file: ${originalFilename}, type: ${file.type}`);

                    if (file.type === 'application/pdf') {
                        const pdf = await PDFLib.PDFDocument.load(bytes);
                        const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
                        copiedPages.forEach(copiedPage => {
                            pdfDoc.addPage(copiedPage);
                            const currentPage = pdfDoc.getPages()[pdfDoc.getPages().length - 1];
                            currentPage.drawText(filenameText, {
                                x: textX,
                                y: textY,
                                size: filenameFontSize,
                                font: helveticaFont,
                                color: textColor,
                            });
                            console.log(`Filename "${filenameText}" added to PDF page.`);
                        });
                    } else if (file.type.startsWith('image/')) {
                        let image;
                        if (file.type === 'image/png') {
                            image = await pdfDoc.embedPng(bytes);
                        } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                            image = await pdfDoc.embedJpg(bytes);
                        }
                        if (image) {
                            const page = pdfDoc.addPage();
                            const { width, height } = image;
                            const pageWidth = page.getWidth();
                            const pageHeight = page.getHeight();
                            const scale = Math.min(pageWidth / width, pageHeight / height) * 0.95;
                            const scaledWidth = width * scale;
                            const scaledHeight = height * scale;

                            page.drawImage(image, {
                                x: pageWidth / 2 - scaledWidth / 2,
                                y: pageHeight / 2 - scaledHeight / 2,
                                width: scaledWidth,
                                height: scaledHeight,
                            });
                            page.drawText(filenameText, {
                                x: textX,
                                y: textY,
                                size: filenameFontSize,
                                font: helveticaFont,
                                color: textColor,
                            });
                            console.log(`Filename "${filenameText}" added to image page.`);
                        }
                    }
                    resolve();
                } catch (error) {
                    console.error('Error embedding file:', error);
                    reject(error);
                }
            };
            reader.onerror = function(error) {
                console.error('Error reading file:', error);
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    exportarPdfButton.addEventListener('click', async function() {
        mensajeExportacionDiv.textContent = 'Generando PDF...';
        const nombreCliente = nombreClienteInput.value.trim();
        if (!nombreCliente) {
            alert('Por favor, ingresa el nombre del cliente.');
            mensajeExportacionDiv.textContent = '';
            return;
        }

        const pdfDoc = await PDFLib.PDFDocument.create();
        const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const headerPage = pdfDoc.addPage();
        const pageWidth = headerPage.getWidth();
        const fontSize = 24;
        const subFontSize = 18;
        const textColor = PDFLib.rgb(0, 0, 0);

        const titleText = 'REPORTE DE IMEI CLONADO/DUPLCIADO';
        const titleWidth = helveticaFont.widthOfTextAtSize(titleText, fontSize);
        const titleX = (pageWidth - titleWidth) / 2;

        const clientText = `Nombre del Cliente: ${nombreCliente}`;
        const clientWidth = helveticaFont.widthOfTextAtSize(clientText, subFontSize);
        const clientX = (pageWidth - clientWidth) / 2;
        const titleY = headerPage.getHeight() - 50;
        const clientY = titleY - fontSize - 10;

        // Add header page
        headerPage.drawText(titleText, {
            x: titleX,
            y: titleY,
            size: fontSize,
            font: helveticaFont,
            color: textColor,
        });
        headerPage.drawText(clientText, {
            x: clientX,
            y: clientY,
            size: subFontSize,
            font: helveticaFont,
            color: textColor,
        });

        try {
            await embedFile(pdfDoc, osiptelCaptureInput.files[0], osiptelCaptureInput.files[0]?.name);
            await embedFile(pdfDoc, transferenciaOsiptelInput.files[0], transferenciaOsiptelInput.files[0]?.name);
            await embedFile(pdfDoc, fotoImeiFisicoInput.files[0], fotoImeiFisicoInput.files[0]?.name);
            await embedFile(pdfDoc, fotoImeiLogicoInput.files[0], fotoImeiLogicoInput.files[0]?.name);
            await embedFile(pdfDoc, solicitudAbonadoInput.files[0], solicitudAbonadoInput.files[0]?.name);
            await embedFile(pdfDoc, validacionIdentidadInput.files[0], validacionIdentidadInput.files[0]?.name);
            await embedFile(pdfDoc, capturaGsmaInput.files[0], capturaGsmaInput.files[0]?.name);

            const pdfBytes = await pdfDoc.save();
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'Reporte_IMEI_Clonado.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            mensajeExportacionDiv.textContent = 'PDF generado y descargado.';

        } catch (error) {
            console.error('Error durante la generación del PDF:', error);
            mensajeExportacionDiv.textContent = 'Error al generar el PDF.';
        }
    });
});