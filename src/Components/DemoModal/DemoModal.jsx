import { useState } from "react";
import "./DemoModal.css";

function DemoModal({ closeModal }) {

    const [form, setForm] = useState({
        name: "",
        company: "",
        mobile: "",
        email: "",
        requirement: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submitDemo = () => {

        const oldData =
            JSON.parse(
                localStorage.getItem("demoRequests")
            ) || [];

        oldData.push(form);

        localStorage.setItem(
            "demoRequests",
            JSON.stringify(oldData)
        );

        alert("Demo Request Submitted!");

        closeModal();
    };

    return (
        <div className="modal-overlay">

            <div className="demo-modal">

                <button
                    className="close-btn"
                    onClick={closeModal}
                >
                    ✖
                </button>

                <h2>Request a Demo</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Business Email"
                    onChange={handleChange}
                />

                <textarea
                    name="requirement"
                    placeholder="Business Requirement"
                    rows="4"
                    onChange={handleChange}
                />

                <button
                    className="demo-submit"
                    onClick={submitDemo}
                >
                    Request Demo
                </button>

            </div>

        </div>
    );
}

export default DemoModal;