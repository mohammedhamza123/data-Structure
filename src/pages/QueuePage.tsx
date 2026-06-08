import { PageHeader } from "../components/PageHeader";
import { QueueVisualizer } from "../visualizers/queue/QueueVisualizer";

export function QueuePage() {
  return (
    <div>
      <PageHeader
        eyebrow="هياكل البيانات"
        title="الطابور (Queue)"
        description="بنية بيانات تعمل بمبدأ FIFO: أول من يدخل أول من يخرج. الإضافة من المؤخرة (rear) والإخراج من المقدمة (front). قارن بين النسخة الخطية والدائرية وشاهد كيف يحل الطابور الدائري مشكلة هدر المساحة."
      />
      <QueueVisualizer />
    </div>
  );
}
