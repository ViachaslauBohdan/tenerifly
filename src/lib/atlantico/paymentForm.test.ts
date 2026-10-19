import { afterEach, describe, expect, it, vi } from "vitest";
import { parsePaymentForm, submitPaymentForm } from "./paymentForm";

const simulatorHtml = `<html><head><title>Comercio Simulador</title></head><body>
<form action="/sis/realizarPago" method="post">
  <input type="hidden" name="Ds_Signature" value="sig&amp;1" />
</form>
<script>document.forms[0].submit();</script>
</body></html>`;

describe("parsePaymentForm", () => {
  it("resolves a relative gateway action and keeps hidden fields", () => {
    expect(
      parsePaymentForm(simulatorHtml, "https://pay.example/checkout")
    ).toEqual({
      action: "https://pay.example/sis/realizarPago",
      method: "POST",
      fields: [{ name: "Ds_Signature", value: "sig&1" }],
    });
  });

  it("ignores HTML that is not a payment form", () => {
    expect(parsePaymentForm("<p>No dates</p>", "https://pay.example")).toBeNull();
  });
});

describe("submitPaymentForm", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("posts the gateway fields in the browser", () => {
    const submit = vi
      .spyOn(HTMLFormElement.prototype, "submit")
      .mockImplementation(() => undefined);

    submitPaymentForm({
      action: "https://sis-t.redsys.es/sis/realizarPago",
      method: "POST",
      fields: [{ name: "Ds_Signature", value: "sig" }],
    });

    const form = document.querySelector("form");
    expect(form?.getAttribute("action")).toBe(
      "https://sis-t.redsys.es/sis/realizarPago"
    );
    expect(form?.querySelector("input")?.value).toBe("sig");
    expect(submit).toHaveBeenCalledOnce();
    submit.mockRestore();
  });
});
