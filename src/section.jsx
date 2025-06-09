import { useRef } from "react";
import jsPDF from "jspdf";

function Section(){
    const inputRef = useRef();

    const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new window.Image();
                img.onload = function() {
                    let imgWidth = pageWidth;
                    let imgHeight = (img.height * pageWidth) / img.width;
                    if (imgHeight > pageHeight) {
                        imgHeight = pageHeight;
                        imgWidth = (img.width * pageHeight) / img.height;
                    }
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2;
                    if (i !== 0) pdf.addPage();
                    pdf.addImage(img, "JPEG", x, y, imgWidth, imgHeight);
                    resolve();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    pdf.save("output.pdf");
};
    return(
        <>
        <div className="container">
            <h1>IMAGE to PDF</h1>
            <p>Convert images to PDF in seconds. Easily adjust orientation and margins.</p>
            <input type="file" id="file-upload" accept="image/jpeg" ref={inputRef} onChange={handleFileChange} multiple/>
            <p>or drop images here</p>
        </div>
        </>
    );
}
export default Section;