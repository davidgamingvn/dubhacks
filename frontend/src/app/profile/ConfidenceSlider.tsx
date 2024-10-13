export default function ConfidenceSlider({ subject, value, change_handler }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full justify-between pl-4">
        <label className="capitalize">{subject}</label>
        <p>{value}%</p>
      </div>
      <input
        type="range"
        min="1"
        max="100"
        name="science"
        className="w-full accent-[#FAF17C]"
        subject={subject}
        value={value}
        onChange={change_handler}
      ></input>
    </div>
  );
}
