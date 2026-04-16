import HistoryLecture from "../components/users/lecture/HistoryLecture";
import FormCreate from "../components/users/FormCreate";

const CreateLecture = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Trung tâm Học tập
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Bắt đầu bài giảng AI mới hoặc tiếp tục tiến độ học tập của bạn.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Creation */}
        <FormCreate typeMode="lecture" />

        {/* History */}
        <HistoryLecture />
      </div>
    </div>
  );
};

export default CreateLecture;
