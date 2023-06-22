import { useForm, SubmitHandler } from "react-hook-form";

enum roomEnum {
  "Open",
  "Social",
  "Closed",
}
type Inputs = {
  topic: string;
  roomType: roomEnum;
};

const RoomForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  console.log(watch("topic"));
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full  h-full   py-8 flex flex-col justify-between"
    >
      <div className="grid gap-1">
        <label className="font-semibold text-2xl ">
          Enter the topic of the room
        </label>
        <input
          {...register("topic", { required: true })}
          className={`${
            errors.topic ? "border-red-custom" : "border-grey-custom"
          } w-full h-12 rounded-md border-2  border-solid focus:outline-blue-custom px-2 text-xl`}
        />
        {errors.topic && (
          <span className=" text-red-custom text-sm font-semibold">
            This field is required
          </span>
        )}
      </div>
      <div className="grid gap-1">
        <label className="font-semibold text-2xl ">Enter the room type</label>
        <select
          {...register("roomType", { required: true })}
          className={`${
            errors.topic ? "border-red-custom" : "border-grey-custom"
          } w-full rounded-md border-2 h-12  border-solid focus:outline-blue-custom px-2 text-xl`}
        >
          <option value="Open">Open</option>
          <option value="Social">Social</option>
          <option value="Closed">Closed</option>
        </select>
        {errors.roomType && (
          <span className=" text-red-custom text-sm font-semibold">
            This field is required
          </span>
        )}
      </div>
      <button
        type="submit"
        className=" bg-blue-custom self-center text-white font-semibold p-2 w-40 h-12 flex items-center justify-center rounded-md  text-lg"
      >
        Create
      </button>
    </form>
  );
};

export default RoomForm;
