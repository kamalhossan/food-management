export default function Form({ handleGenerate, handleChange, formData }) {
  return (
    <section
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <h2>Generate User Barcode</h2>
      <form
        onSubmit={handleGenerate}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label>Name: </label>
          <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>Serial: </label>
          <br />
          <input
            type="text"
            name="serial_no"
            value={formData.serial_no}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>Company: </label>
          <br />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create Now
        </button>
      </form>

      {/* <ul>
        {ids.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>{item.id}</span>
            <span>{item.age}</span>
          </li>
        ))}
      </ul> */}
    </section>
  );
}
