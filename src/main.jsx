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

const DELIVERY_FEE = 8;

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

const PAYMENT_METHODS = [
  { value: "PIX", icon: "💠" },
  { value: "Dinheiro", icon: "💵" },
  { value: "Cartão", icon: "💳" },
];

const money = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-xl bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
      >
        {quantity === 1 ? <Trash2 size={15} /> : <Minus size={16} />}
      </button>

      <span className="w-6 text-center text-sm font-black text-slate-950">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0d9f61] text-white"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function CartItem({ item, onChange }) {
  return (
    <div className="grid w-full min-w-0 grid-cols-[56px_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-2xl bg-[#f5f7f5] p-3 sm:flex sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">
        {item.emoji}
      </div>

      <div className="min-w-0">
        <p className="truncate font-black text-slate-950">
          {item.name}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {money(item.price)} cada
        </p>

        <p className="mt-1 text-sm font-black text-slate-950 sm:hidden">
          {money(item.price * item.quantity)}
        </p>
      </div>

      <div className="col-start-2 flex justify-end sm:ml-auto sm:w-auto">
        <QuantityControl
          quantity={item.quantity}
          onDecrease={() => onChange(item.id, -1)}
          onIncrease={() => onChange(item.id, 1)}
        />
      </div>

      <p className="hidden w-20 shrink-0 text-right text-sm font-black text-slate-950 sm:block">
        {money(item.price * item.quantity)}
      </p>
    </div>
  );
}

function PaymentMethods({ value, onChange }) {
  return (
    <div>
      <span className="text-sm font-bold text-slate-950">
        Forma de pagamento
      </span>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {PAYMENT_METHODS.map((payment) => (
          <button
            key={payment.value}
            type="button"
            onClick={() => onChange(payment.value)}
            className={`rounded-2xl border p-4 text-center transition active:scale-95 ${
              value === payment.value
                ? "border-[#0d9f61] bg-emerald-50 text-[#0d9f61]"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <div className="text-xl">{payment.icon}</div>
            <div className="mt-1 text-sm font-black">
              {payment.value}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SuccessScreen({ onNewOrder }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f5] p-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check size={38} strokeWidth={3} />
        </div>

        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
          Pedido recebido
        </p>

        <h1 className="text-3xl font-black text-slate-950">
          Agora é só aguardar 🍻
        </h1>

        <p className="mt-3 text-slate-500">
          Seu pedido foi enviado. Em breve entraremos em contato
          para confirmar a entrega.
        </p>

        <button
          onClick={onNewOrder}
          className="mt-7 w-full rounded-2xl bg-slate-950 py-4 font-bold text-white"
        >
          Fazer outro pedido
        </button>
      </div>
    </div>
  );
}

function Checkout({
  items,
  itemCount,
  subtotal,
  total,
  address,
  setAddress,
  phone,
  setPhone,
  paymentMethod,
  setPaymentMethod,
  changeQuantity,
  sendOrder,
  goBack,
}) {
  const valid =
    items.length > 0 &&
    address.street &&
    address.number &&
    address.neighborhood &&
    phone &&
    paymentMethod;

  return (
    <div className="min-h-screen bg-[#f5f7f5]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f5f7f5]/90 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <button
            onClick={goBack}
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

      <main className="mx-auto max-w-xl space-y-6 px-5 pb-32 pt-6">
        {/* CARRINHO */}

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-950">
                Seu carrinho
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {itemCount} {itemCount === 1 ? "item" : "itens"} no pedido
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#0d9f61]">
              <ShoppingBag size={21} />
            </div>
          </div>

          <div className="mt-5 grid w-full min-w-0 gap-3">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onChange={changeQuantity}
              />
            ))}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold">{money(subtotal)}</span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-500">Entrega</span>
              <span className="font-bold">{money(DELIVERY_FEE)}</span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#07110d] p-4 text-white">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-black">
                {money(total)}
              </span>
            </div>
          </div>
        </section>

        {/* ENDEREÇO */}

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-slate-950">
            Endereço de entrega
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Só precisamos do básico para encontrar você.
          </p>

          <div className="mt-6 grid gap-4">
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

            <label className="field">
              <span>Telefone</span>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(16) 99999-9999"
              />
            </label>

            <PaymentMethods
              value={paymentMethod}
              onChange={setPaymentMethod}
            />

            {paymentMethod && (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
                <span className="font-bold">
                  Pagamento:
                </span>{" "}
                {paymentMethod}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FINALIZAR */}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/90 p-4 backdrop-blur-xl">
        <div className="mx-auto max-w-xl">
          <button
            disabled={!valid}
            onClick={sendOrder}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0d9f61] py-4 font-black text-white shadow-lg shadow-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            Finalizar pedido
            <ChevronRight size={20} />
          </button>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            {paymentMethod
              ? `Pagamento em ${paymentMethod.toLowerCase()}`
              : "Escolha uma forma de pagamento"}{" "}
            • Total {money(total)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Shop({
  items,
  itemCount,
  cart,
  category,
  setCategory,
  changeQuantity,
  goCheckout,
}) {
  const filtered =
    category === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === category);

  return (
    <div className="min-h-screen bg-[#f5f7f5] pb-32">
      <header className="bg-[#07110d] text-white">
        <div className="mx-auto max-w-xl px-5 pb-8 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d9f61]">
                <Beer size={22} />
              </div>

              <span className="text-lg font-black">
                Bora Bebê
              </span>
            </div>

            <button
              onClick={goCheckout}
              disabled={!items.length}
              className="relative rounded-full bg-white/10 p-3 disabled:opacity-40"
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
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold ${
                category === name
                  ? "bg-[#0d9f61] text-white"
                  : "bg-white text-slate-500 shadow-sm"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* PRODUTOS */}

        <section className="mt-7">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Seu rolê começa aqui
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Escolha suas bebidas
          </h2>

          <div className="mt-4 grid gap-3">
            {filtered.map((product) => {
              const quantity = cart[product.id] || 0;

              return (
                <article
                  key={product.id}
                  className="flex min-w-0 items-center gap-3 rounded-[1.5rem] bg-white p-3 shadow-sm"
                >
                  <div
                    className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl ${
                      product.featured
                        ? "bg-[#e8f5ed]"
                        : "bg-slate-100"
                    }`}
                  >
                    <span className="text-5xl">
                      {product.emoji}
                    </span>

                    {product.featured && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#07110d] px-2 py-1 text-[8px] font-black uppercase text-white">
                        Top
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-black text-slate-950">
                      {product.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {product.description}
                    </p>

                    <p className="mt-3 text-lg font-black">
                      {money(product.price)}
                    </p>
                  </div>

                  {quantity === 0 ? (
                    <button
                      onClick={() =>
                        changeQuantity(product.id, 1)
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#07110d] text-white"
                    >
                      <Plus size={21} />
                    </button>
                  ) : (
                    <QuantityControl
                      quantity={quantity}
                      onDecrease={() =>
                        changeQuantity(product.id, -1)
                      }
                      onIncrease={() =>
                        changeQuantity(product.id, 1)
                      }
                    />
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ENTREGA */}

        <div className="mt-8 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2">
              <MapPin size={18} className="text-emerald-600" />
            </div>

            <div>
              <p className="font-black text-emerald-900">
                Entrega a partir de {money(DELIVERY_FEE)}
              </p>

              <p className="mt-0.5 text-xs text-emerald-700/70">
                Simples, rápido e sem cadastro.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* CARRINHO */}

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-4">
          <div className="mx-auto max-w-xl">
            <button
              onClick={goCheckout}
              className="flex w-full items-center justify-between rounded-2xl bg-[#0d9f61] px-5 py-4 text-white shadow-2xl"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <ShoppingBag size={17} />
                </span>

                <span className="text-left">
                  <span className="block text-[11px] font-bold text-white/65">
                    {itemCount} {itemCount === 1 ? "item" : "itens"}
                  </span>

                  <span className="block font-black">
                    {money(
                      items.reduce(
                        (sum, item) =>
                          sum + item.price * item.quantity,
                        0
                      )
                    )}
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

function App() {
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("Todos");
  const [step, setStep] = useState("shop");
  const [sent, setSent] = useState(false);

  const [address, setAddress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    reference: "",
  });

  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const items = useMemo(
    () =>
      PRODUCTS.filter((product) => cart[product.id]).map((product) => ({
        ...product,
        quantity: cart[product.id],
      })),
    [cart]
  );

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + (items.length ? DELIVERY_FEE : 0);

  function changeQuantity(id, delta) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] || 0) + delta;

      if (quantity <= 0) delete next[id];
      else next[id] = quantity;

      return next;
    });
  }

  function createOrderMessage() {
    return [
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
      address.neighborhood,
      address.reference
        ? `Referência: ${address.reference}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function sendOrder() {
    if (
      !items.length ||
      !address.street ||
      !address.number ||
      !address.neighborhood ||
      !phone ||
      !paymentMethod
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

      // Só limpa depois que o backend confirmar o envio.
      setCart({});
      setAddress({
        street: "",
        number: "",
        neighborhood: "",
        reference: "",
      });
      setPhone("");
      setPaymentMethod("");
      setSent(true);
    } catch (error) {
      console.error(error);
      alert("Não foi possível enviar o pedido. Tente novamente.");
    }
  }

  if (sent) {
    return (
      <SuccessScreen
        onNewOrder={() => {
          setSent(false);
          setStep("shop");
        }}
      />
    );
  }

  if (step === "checkout") {
    return (
      <Checkout
        items={items}
        itemCount={itemCount}
        subtotal={subtotal}
        total={total}
        address={address}
        setAddress={setAddress}
        phone={phone}
        setPhone={setPhone}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        changeQuantity={changeQuantity}
        sendOrder={sendOrder}
        goBack={() => setStep("shop")}
      />
    );
  }

  return (
    <Shop
      items={items}
      itemCount={itemCount}
      cart={cart}
      category={category}
      setCategory={setCategory}
      changeQuantity={changeQuantity}
      goCheckout={() => items.length && setStep("checkout")}
    />
  );
}

createRoot(document.getElementById("root")).render(<App />);