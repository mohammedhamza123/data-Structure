import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LinkedListPage } from "./pages/LinkedListPage";
import { StackPage } from "./pages/StackPage";
import { QueuePage } from "./pages/QueuePage";
import { SortingPage } from "./pages/SortingPage";
import { TreesPage } from "./pages/TreesPage";
import { RecursionPage } from "./pages/RecursionPage";
import { BinarySearchPage } from "./pages/BinarySearchPage";
import { ComplexityPage } from "./pages/ComplexityPage";
import { MatrixPage } from "./pages/MatrixPage";
import { CppPointersPage } from "./pages/CppPointersPage";
import { CppStructPage } from "./pages/CppStructPage";
import { CppFunctionsPage } from "./pages/CppFunctionsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/linked-list" element={<LinkedListPage />} />
        <Route path="/matrices" element={<MatrixPage />} />
        <Route path="/stack" element={<StackPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/complexity" element={<ComplexityPage />} />
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/binary-search" element={<BinarySearchPage />} />
        <Route path="/recursion" element={<RecursionPage />} />
        <Route path="/trees" element={<TreesPage />} />
        <Route path="/cpp/pointers" element={<CppPointersPage />} />
        <Route path="/cpp/struct" element={<CppStructPage />} />
        <Route path="/cpp/functions" element={<CppFunctionsPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
