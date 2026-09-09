import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  Beer,
  Check,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import "./index.css";

// =========================
// CONFIGURAÇÕES
// =========================

const DELIVERY_FEE = 8;

// =========================
// PRODUTOS
// =========================

const PRODUCTS = [
  {
    id: 1,
    name: "Cerveja Pilsen",
    description: "Lata 350ml • gelada",
    price: 5.5,
    emoji: "🍺",
    category: "Cervejas",
    featured: true,
  },
  {
    id: 2,
    name: "Cerveja Long Neck",
    description: "330ml • bem gelada",
    price: 7.9,
    emoji: "🍻",
    category: "Cervejas",
    featured: true,
  },
  {
    id: 3,
    name: "Heineken",
    description: "Long Neck 330ml",
    price: 9.9,
    emoji: "🍺",
    category: "Cervejas",
  },
  {
    id: 4,
    name: "Coca-Cola",
    description: "Lata 350ml • gelada",
    price: 6,
    emoji: "🥤",
    category: "Refrigerantes",
  },
  {
    id: 5,
    name: "Guaraná",
    description: "Lata 350ml • gelado",
    price: 5.5,
    emoji: "🥤",
    category: "Refrigerantes",
  },
  {
    id: 6,
    name: "Água",
    description: "Garrafa 500ml",
    price: 3,
    emoji: "💧",
    category: "Outros",
  },
  {
    id: 7,
    name: "Energético",
    description: "Lata 269ml",
    price: 10.9,
    emoji: "⚡",
    category: "Outros",
  },
  {
    id: 8,
    name: "Vodka",
    description: "Garrafa 1L",
    price: 39.9,
    emoji: "🍸",
    category: "Destilados",
  },
];

const CATEGORIES = [
  "Todos",
  "Cervejas",
  "Refrigerantes",
  "Destilados",
  "Outros",
];

// =========================
// FORMATAÇÃO
// =========================

function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// =========================
// APP
// =========================

function App() {
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("Todos");
  const [step, setStep] = useState("shop");

  const [address, setAddress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    reference: "",
  });

  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [sent, setSent] = useState(false);

  // =========================
  // ITENS DO CARRINHO
  // =========================

  const items = useMemo(
    () =>
      PRODUCTS.filter((product) => cart[product.id]).map((product) => ({
        ...product,
        quantity: cart[product.id],
      })),
    [cart]
  );

  // =========================
  // VALORES
  // =========================

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + (items.length ? DELIVERY_FEE : 0);

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // =========================
  // FILTRO
  // =========================

  const filtered =
    category === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === category);

  // =========================
  // ADICIONAR / REMOVER
  // =========================

  function changeQuantity(id, delta) {
    setCart((current) => {
      const next = { ...current };

      const quantity = (next[id] || 0) + delta;

      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  }

  // =========================
  // MENSAGEM DO PEDIDO
  // =========================

  function createOrderMessage() {
    const lines = [
      "🛵 *NOVO PEDIDO — Bora Bebê*",
      "",

      "🛒 *ITENS DO PEDIDO*",

      ...items.map(
        (item) =>
          `• ${item.quantity}x ${item.name} — ${money(
            item.price * item.quantity
          )}`
      ),

      "",

      `Subtotal: ${money(subtotal)}`,
      `Entrega: ${money(DELIVERY_FEE)}`,
      `*Total: ${money(total)}*`,

      "",

      "📱 *CONTATO*",
      `Telefone: ${phone}`,

      "",

      "💳 *PAGAMENTO*",
      `Forma: ${paymentMethod}`,

      "",

      "📍 *ENTREGA*",
      `${address.street}, ${address.number}`,
      `${address.neighborhood}`,
      address.reference
        ? `Referência: ${address.reference}`
        : "",
    ].filter(Boolean);

    return lines.join("\n");
  }

  // =========================
  // ENVIAR PEDIDO
  // =========================

  async function sendOrder() {
    if (
      !address.street ||
      !address.number ||
      !address.neighborhood ||
      !phone ||
      !paymentMethod ||
      !items.length
    ) {
      return;
    }

    try {
      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: createOrderMessage(),
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar pedido");
      }

      // =========================
      // LIMPA O CARRINHO
      // =========================

      setCart({});

      // Limpa os dados do pedido
      setAddress({
        street: "",
        number: "",
        neighborhood: "",
        reference: "",
      });

      setPhone("");
      setPaymentMethod("");

      // Mostra tela de sucesso
      setSent(true);
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível enviar o pedido agora. Tente novamente."
      );
    }
  }

  // =========================
  // PEDIDO ENVIADO
  // =========================

  if (sent) {
    return (
      <div className="min-h-screen bg-[#f5f7f5] flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-black/5">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check size={38} strokeWidth={3} />
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
            Pedido recebido
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Agora é só aguardar 🍻
          </h1>

          <p className="mt-3 text-slate-500">
            Seu pedido foi enviado. Em breve entraremos em contato
            para confirmar a entrega.
          </p>

          <button
            onClick={() => {
              setSent(false);
              setStep("shop");
            }}
            className="mt-7 w-full rounded-2xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800"
          >
            Fazer outro pedido
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // TELA DE FINALIZAÇÃO
  // =========================

  if (step === "address") {
    const valid =
      address.street &&
      address.number &&
      address.neighborhood &&
      phone &&
      paymentMethod &&
      items.length > 0;

    return (
      <div className="min-h-screen bg-[#f5f7f5]">
        {/* HEADER */}

        <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f5f7f5]/90 px-5 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <button
              onClick={() => setStep("shop")}
              className="rounded-full bg-white p-2.5 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Quase lá
              </p>

              <h2 className="font-black text-slate-950">
                Finalizar pedido
              </h2>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-xl px-5 pb-32 pt-6">
          {/* =========================
              CARRINHO
          ========================= */}

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  Seu carrinho
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {itemCount}{" "}
                  {itemCount === 1 ? "item" : "itens"} no pedido
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#0d9f61]">
                <ShoppingBag size={21} />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl bg-[#f5f7f5] p-3"
                >
                  {/* PRODUTO */}

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">
                    {item.emoji}
                  </div>

                  {/* NOME + PREÇO */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-slate-950">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {money(item.price)} cada
                    </p>
                  </div>

                  {/* QUANTIDADE */}

                  <div className="flex items-center gap-1 rounded-xl bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(item.id, -1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 active:scale-95"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 size={15} />
                      ) : (
                        <Minus size={16} />
                      )}
                    </button>

                    <span className="w-6 text-center text-sm font-black text-slate-950">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(item.id, 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d9f61] text-white transition active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* TOTAL DO ITEM */}

                  <div className="hidden w-20 text-right sm:block">
                    <p className="text-sm font-black text-slate-950">
                      {money(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* RESUMO */}

            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Subtotal
                </span>

                <span className="font-bold text-slate-950">
                  {money(subtotal)}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-500">
                  Entrega
                </span>

                <span className="font-bold text-slate-950">
                  {money(DELIVERY_FEE)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#07110d] p-4 text-white">
                <span className="font-bold">
                  Total
                </span>

                <span className="text-2xl font-black">
                  {money(total)}
                </span>
              </div>
            </div>
          </section>

          {/* =========================
              ENDEREÇO
          ========================= */}

          <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-950">
              Endereço de entrega
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Só precisamos do básico para encontrar você.
            </p>

            <div className="mt-6 grid gap-4">
              {/* RUA */}

              <label className="field">
                <span>Rua / Avenida</span>

                <input
                  value={address.street}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      street: e.target.value,
                    })
                  }
                  placeholder="Ex.: Rua das Flores"
                />
              </label>

              {/* NUMERO + BAIRRO */}

              <div className="grid grid-cols-[1fr_2fr] gap-3">
                <label className="field">
                  <span>Número</span>

                  <input
                    value={address.number}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        number: e.target.value,
                      })
                    }
                    placeholder="123"
                  />
                </label>

                <label className="field">
                  <span>Bairro</span>

                  <input
                    value={address.neighborhood}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        neighborhood: e.target.value,
                      })
                    }
                    placeholder="Seu bairro"
                  />
                </label>
              </div>

              {/* REFERÊNCIA */}

              <label className="field">
                <span>
                  Referência <small>(opcional)</small>
                </span>

                <input
                  value={address.reference}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      reference: e.target.value,
                    })
                  }
                  placeholder="Ex.: perto da praça"
                />
              </label>

              {/* TELEFONE */}

              <label className="field">
                <span>Telefone</span>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="(16) 99999-9999"
                />
              </label>

              {/* =========================
                  PAGAMENTO
              ========================= */}

              <div className="mt-2">
                <span className="text-sm font-bold text-slate-950">
                  Forma de pagamento
                </span>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {/* PIX */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod("PIX")
                    }
                    className={`rounded-2xl border p-4 text-center transition active:scale-95 ${
                      paymentMethod === "PIX"
                        ? "border-[#0d9f61] bg-emerald-50 text-[#0d9f61]"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <div className="text-xl">
                      💠
                    </div>

                    <div className="mt-1 text-sm font-black">
                      PIX
                    </div>
                  </button>

                  {/* DINHEIRO */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod("Dinheiro")
                    }
                    className={`rounded-2xl border p-4 text-center transition active:scale-95 ${
                      paymentMethod === "Dinheiro"
                        ? "border-[#0d9f61] bg-emerald-50 text-[#0d9f61]"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <div className="text-xl">
                      💵
                    </div>

                    <div className="mt-1 text-sm font-black">
                      Dinheiro
                    </div>
                  </button>

                  {/* CARTÃO */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod("Cartão")
                    }
                    className={`rounded-2xl border p-4 text-center transition active:scale-95 ${
                      paymentMethod === "Cartão"
                        ? "border-[#0d9f61] bg-emerald-50 text-[#0d9f61]"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <div className="text-xl">
                      💳
                    </div>

                    <div className="mt-1 text-sm font-black">
                      Cartão
                    </div>
                  </button>
                </div>
              </div>

              {/* PAGAMENTO SELECIONADO */}

              {paymentMethod && (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
                  <span className="font-bold">
                    Pagamento selecionado:
                  </span>{" "}
                  {paymentMethod}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* =========================
            BOTÃO FINALIZAR
        ========================= */}

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl">
          <div className="mx-auto max-w-xl">
            <button
              disabled={!valid}
              onClick={sendOrder}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0d9f61] py-4 font-black text-white shadow-lg shadow-emerald-600/20 transition active:scale-[.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              Finalizar pedido
              <ChevronRight size={20} />
            </button>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              {paymentMethod
                ? `Pagamento em ${paymentMethod.toLowerCase()}`
                : "Escolha uma forma de pagamento"}
              {" • "}
              Total {money(total)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // LOJA
  // =========================

  return (
    <div className="min-h-screen bg-[#f5f7f5] pb-32">
      {/* HEADER */}

      <header className="bg-[#07110d] text-white">
        <div className="mx-auto max-w-xl px-5 pb-8 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d9f61]">
                <Beer size={22} />
              </div>

              <span className="text-lg font-black tracking-tight">
                Bora Bebê
              </span>
            </div>

            {/* ÍCONE DO CARRINHO */}

            <button
              onClick={() =>
                items.length && setStep("address")
              }
              className="relative rounded-full bg-white/10 p-3 transition hover:bg-white/15"
            >
              <ShoppingBag size={20} />

              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffb703] px-1 text-[10px] font-black text-slate-950">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <div className="mt-10">
            <div className="mb-3 flex items-center gap-2 text-emerald-300">
              <Sparkles size={16} />

              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Gelou, pediu, chegou
              </span>
            </div>

            <h1 className="max-w-sm text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl">
              O que vai gelar sua noite?
            </h1>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
              Escolha suas bebidas. A gente cuida do resto.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5">
        {/* CATEGORIAS */}

        <div className="-mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((name) => (
            <button
              key={name}
              onClick={() => setCategory(name)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                category === name
                  ? "bg-[#0d9f61] text-white shadow-lg shadow-emerald-700/20"
                  : "bg-white text-slate-500 shadow-sm"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* PRODUTOS */}

        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Seu rolê começa aqui
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Escolha suas bebidas
              </h2>
            </div>
          </div>

          <div className="grid gap-3">
            {filtered.map((product) => {
              const quantity = cart[product.id] || 0;

              return (
                <article
                  key={product.id}
                  className="group flex items-center gap-4 rounded-[1.5rem] bg-white p-3 shadow-sm transition hover:shadow-md"
                >
                  {/* IMAGEM */}

                  <div
                    className={`relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${
                      product.featured
                        ? "bg-[#e8f5ed]"
                        : "bg-slate-100"
                    }`}
                  >
                    <span className="text-5xl transition duration-300 group-hover:scale-110">
                      {product.emoji}
                    </span>

                    {product.featured && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#07110d] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white">
                        Top
                      </span>
                    )}
                  </div>

                  {/* INFORMAÇÕES */}

                  <div className="min-w-0 flex-1 py-1">
                    <h3 className="truncate font-black text-slate-950">
                      {product.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {product.description}
                    </p>

                    <p className="mt-3 text-lg font-black text-slate-950">
                      {money(product.price)}
                    </p>
                  </div>

                  {/* QUANTIDADE */}

                  <div className="shrink-0">
                    {quantity === 0 ? (
                      <button
                        onClick={() =>
                          changeQuantity(product.id, 1)
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#07110d] text-white shadow-md transition active:scale-95"
                      >
                        <Plus size={21} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl bg-[#eef6f1] p-1">
                        <button
                          onClick={() =>
                            changeQuantity(product.id, -1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm"
                        >
                          {quantity === 1 ? (
                            <Trash2 size={15} />
                          ) : (
                            <Minus size={17} />
                          )}
                        </button>

                        <span className="w-5 text-center text-sm font-black">
                          {quantity}
                        </span>

                        <button
                          onClick={() =>
                            changeQuantity(product.id, 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d9f61] text-white"
                        >
                          <Plus size={17} />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ENTREGA */}

        <div className="mt-8 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2">
              <MapPin size={18} className="text-emerald-600" />
            </div>

            <div>
              <p className="font-black">
                Entrega a partir de {money(DELIVERY_FEE)}
              </p>

              <p className="mt-0.5 text-xs text-emerald-700/70">
                Simples, rápido e sem cadastro.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =========================
          BOTÃO DO CARRINHO
      ========================= */}

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-xl">
            <button
              onClick={() => setStep("address")}
              className="flex w-full items-center justify-between rounded-2xl bg-[#0d9f61] px-5 py-4 text-white shadow-2xl shadow-emerald-900/25 transition active:scale-[.98]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <ShoppingBag size={17} />
                </span>

                <span className="text-left">
                  <span className="block text-[11px] font-bold text-white/65">
                    {itemCount}{" "}
                    {itemCount === 1
                      ? "item"
                      : "itens"}
                  </span>

                  <span className="block font-black">
                    {money(subtotal)}
                  </span>
                </span>
              </span>

              <span className="flex items-center gap-1 font-black">
                Ver carrinho
                <ChevronRight size={20} />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <App />
);
