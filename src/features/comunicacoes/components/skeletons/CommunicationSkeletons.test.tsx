import { render, screen } from "@testing-library/react";
import { CommunicationPageSkeleton } from "@/features/comunicacoes/components/skeletons/CommunicationSkeletons";
import { describe, it, expect } from "vitest";

describe("CommunicationPageSkeleton", () => {
  it("should render skeleton without infinite loops", () => {
    const renderStart = Date.now();

    render(<CommunicationPageSkeleton />);

    const renderTime = Date.now() - renderStart;

    // Should render quickly (< 100ms)
    expect(renderTime).toBeLessThan(100);

    // Should have skeleton elements
    expect(screen.getByTestId("skeleton-page")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<CommunicationPageSkeleton />);

    const skeleton = screen.getByTestId("skeleton-page");
    expect(skeleton).toHaveAttribute(
      "aria-label",
      "Carregando página de comunicações",
    );
  });
});
