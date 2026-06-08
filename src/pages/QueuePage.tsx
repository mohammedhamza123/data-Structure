import { PageHeader } from "../components/PageHeader";
import { QueueVisualizer } from "../visualizers/queue/QueueVisualizer";
import { useLang } from "../i18n";

export function QueuePage() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader
        eyebrow={t("هياكل البيانات", "Data Structures")}
        title={t("الطابور (Queue)", "Queue")}
        description={t(
          "بنية بيانات تعمل بمبدأ FIFO: أول من يدخل أول من يخرج. الإضافة من المؤخرة (rear) والإخراج من المقدمة (front). قارن بين النسخة الخطية والدائرية وشاهد كيف يحل الطابور الدائري مشكلة هدر المساحة.",
          "A FIFO data structure: first in, first out. Insertion happens at the rear and removal at the front. Compare the linear and circular versions and see how the circular queue solves wasted-space."
        )}
      />
      <QueueVisualizer />
    </div>
  );
}
