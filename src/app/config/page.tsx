"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import LinkEditor from "../components/Config/LinkEditor";
import SocialEditor from "../components/Config/SocialEditor";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ConfigPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const router = useRouter();
  const [deletedLinkIds, setDeletedLinkIds] = useState<string[]>([]);
  const [deletedSocialIds, setDeletedSocialIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) setUser(data.user);
        setLoading(false);
      });
  }, [router]);

  useEffect(() => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((data) => {
        console.log("[ConfigPage] Links data received:", data);
        const sortedData = data.sort(
          (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
        );
        setLinks(sortedData);
      });

    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => {
        console.log("[ConfigPage] Socials data received:", data);
        const sortedData = data.sort(
          (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
        );
        console.log("[ConfigPage] Socials sorted data:", sortedData);
        setSocials(sortedData);
      })
      .catch((error) => {
        console.error("[ConfigPage] Error fetching socials:", error);
      });
  }, []);

  useEffect(() => {
    console.log("[ConfigPage] Socials state changed:", socials);
  }, [socials]);

  const reassignLinkOrders = useCallback((items: any[], type: string) => {
    return items.map((item, index) => {
      if (item.type === type) {
        return { ...item, order: index };
      }
      return item;
    });
  }, []);

  const reassignSocialOrders = useCallback((items: any[]) => {
    return items.map((item, index) => ({ ...item, order: index }));
  }, []);

  const getSortedLinksByType = useCallback(
    (type: string) => {
      const filtered = links.filter((l) => l.type === type);
      console.log(`[ConfigPage] getSortedLinksByType(${type}):`, filtered);
      return filtered.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
    [links]
  );

  const getSortedSocials = useCallback(() => {
    const sorted = [...socials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    console.log("[ConfigPage] getSortedSocials result:", sorted);
    return sorted;
  }, [socials]);

  const handleChangeLink = useCallback((updated: any) => {
    console.log("[ConfigPage] handleChangeLink:", updated);
    setLinks((prevLinks) => {
      return prevLinks.map((l) => {
        const shouldUpdate =
          (l._id && l._id === updated._id) ||
          (l.tempId && l.tempId === updated.tempId);

        if (shouldUpdate) {
          return { ...l, ...updated };
        }
        return l;
      });
    });
  }, []);

  const handleChangeSocial = useCallback((updated: any) => {
    console.log("[ConfigPage] handleChangeSocial:", updated);
    setSocials((prevSocials) => {
      const newSocials = prevSocials.map((s) => {
        const shouldUpdate =
          (s._id && updated._id && s._id === updated._id) ||
          (s.tempId && updated.tempId && s.tempId === updated.tempId);

        if (shouldUpdate) {
          return { ...s, ...updated };
        }
        return s;
      });
      console.log("[ConfigPage] handleChangeSocial result:", newSocials);
      return newSocials;
    });
  }, []);

  const handleDeleteLink = useCallback(
    (item: any) => {
      if (isDragging) return;

      console.log("[ConfigPage] handleDeleteLink:", item);

      if (item._id) {
        setDeletedLinkIds((prev) => [...prev, item._id]);
      }

      setLinks((prevLinks) => {
        return prevLinks.filter((l) => {
          if (item._id) {
            return l._id !== item._id;
          }
          if (item.tempId) {
            return l.tempId !== item.tempId;
          }
          return true;
        });
      });
    },
    [isDragging]
  );

  const handleDeleteSocial = useCallback(
    (item: any) => {
      if (isDragging) return;

      console.log("[ConfigPage] handleDeleteSocial:", item);

      if (item._id) {
        setDeletedSocialIds((prev) => [...prev, item._id]);
      }

      setSocials((prevSocials) => {
        const filtered = prevSocials.filter((s) => {
          if (item._id) {
            return s._id !== item._id;
          }
          if (item.tempId) {
            return s.tempId !== item.tempId;
          }
          return true;
        });
        console.log("[ConfigPage] handleDeleteSocial result:", filtered);
        return filtered;
      });
    },
    [isDragging]
  );

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragCancel = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragEndLinks = useCallback((type: string) => {
    return (event: DragEndEvent) => {
      setIsDragging(false);

      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setLinks((prevLinks) => {
        const currentTypeItems = prevLinks
          .filter((l) => l.type === type)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const otherTypeItems = prevLinks.filter((l) => l.type !== type);

        const oldIndex = currentTypeItems.findIndex(
          (item) => (item._id || item.tempId) === active.id
        );
        const newIndex = currentTypeItems.findIndex(
          (item) => (item._id || item.tempId) === over.id
        );

        if (oldIndex === -1 || newIndex === -1) {
          return prevLinks;
        }

        const reorderedItems = arrayMove(
          currentTypeItems,
          oldIndex,
          newIndex
        ).map((item, index) => ({ ...item, order: index }));

        return [...otherTypeItems, ...reorderedItems];
      });
    };
  }, []);

  const handleDragEndSocials = useCallback((event: DragEndEvent) => {
    setIsDragging(false);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSocials((prevSocials) => {
      const currentItems = [...prevSocials].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );

      const oldIndex = currentItems.findIndex(
        (item) => (item._id || item.tempId) === active.id
      );
      const newIndex = currentItems.findIndex(
        (item) => (item._id || item.tempId) === over.id
      );

      if (oldIndex === -1 || newIndex === -1) {
        return prevSocials;
      }

      return arrayMove(currentItems, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }));
    });
  }, []);

  function generateTempId() {
    return "temp-" + Math.random().toString(36).slice(2, 10);
  }

  const addNewLink = useCallback((type: string) => {
    setLinks((prev) => {
      const sameTypeItems = prev.filter((l) => l.type === type);
      const nextOrder = sameTypeItems.length;

      return [
        ...prev,
        {
          type,
          tempId: generateTempId(),
          order: nextOrder,
          title: "",
          href: "",
          image: "",
        },
      ];
    });
  }, []);

  const addNewSocial = useCallback(() => {
    console.log("[ConfigPage] addNewSocial called");
    setSocials((prev) => {
      const nextOrder = prev.length;
      const newSocial = {
        tempId: generateTempId(),
        title: "",
        href: "",
        icon: "email",
        order: nextOrder,
      };
      console.log("[ConfigPage] addNewSocial creating:", newSocial);
      const newSocials = [...prev, newSocial];
      console.log("[ConfigPage] addNewSocial result:", newSocials);
      return newSocials;
    });
  }, []);

  const handleSaveAll = async () => {
    try {
      const validLinks = links.filter((l) => l.title && l.href && l.type);
      const validSocials = socials.filter((s) => s.title && s.href && s.icon);

      console.log("[ConfigPage] Saving validLinks:", validLinks);
      console.log("[ConfigPage] Saving validSocials:", validSocials);

      await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: validLinks, deletedIds: deletedLinkIds }),
      });

      await fetch("/api/socials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socials: validSocials,
          deletedIds: deletedSocialIds,
        }),
      });

      setModalMessage("Semua perubahan telah disimpan!");
      setModalOpen(true);

      const [linksRes, socialsRes] = await Promise.all([
        fetch("/api/links").then((res) => res.json()),
        fetch("/api/socials").then((res) => res.json()),
      ]);

      // console.log("[ConfigPage] Refetched links:", linksRes);
      // console.log("[ConfigPage] Refetched socials:", socialsRes);

      setLinks(
        linksRes.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      );
      setSocials(
        socialsRes.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      );

      setDeletedLinkIds([]);
      setDeletedSocialIds([]);
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = setTimeout(() => setModalOpen(false), 2000);
    } catch (e) {
      setModalMessage("Gagal menyimpan perubahan.");
      setModalOpen(true);
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = setTimeout(() => setModalOpen(false), 2000);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-400 mb-6"></div>
        <div className="text-xl font-semibold text-amber-800 mb-2">
          Memuat data...
        </div>
        <div className="text-amber-500">Mohon tunggu sebentar</div>
      </div>
    );
  if (!user) return null;

  console.log("[ConfigPage] Rendering with socials:", socials);
  const sortedSocials = getSortedSocials();
  console.log("[ConfigPage] Sorted socials for rendering:", sortedSocials);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      {modalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 text-amber-900 font-bold text-lg border border-amber-300">
            {modalMessage}
          </div>
        </div>
      )}

      <div className="bg-[#f6eede] rounded-xl shadow-lg p-8 border border-amber-200">
        <h1 className="text-3xl font-bold mb-4 text-amber-900">
          Konfigurasi Link & Sosial
        </h1>
        <p className="mb-8 text-amber-800 text-lg">
          Selamat datang,{" "}
          <span className="font-semibold text-amber-900">{user.username}</span>!
        </p>

        {/*
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <p>Socials count: {socials.length}</p>
          <p>Sorted socials count: {sortedSocials.length}</p>
          <pre className="text-xs">
            {JSON.stringify(sortedSocials, null, 2)}
          </pre>
        </div> */}

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-amber-900 border-b-2 border-amber-300 pb-2">
          Link Utama
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndLinks("main")}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={getSortedLinksByType("main").map(
              (item) => item._id || item.tempId
            )}
            strategy={verticalListSortingStrategy}
          >
            {getSortedLinksByType("main").map((item) => (
              <SortableLinkEditor
                key={item._id || item.tempId}
                id={item._id || item.tempId}
                item={item}
                onChange={handleChangeLink}
                onDelete={handleDeleteLink}
                forcedType="main"
                isDragging={isDragging}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button
          onClick={() => addNewLink("main")}
          className="w-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 rounded-lg mt-3 transition-all duration-200 border border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-md disabled:opacity-50"
        >
          + Tambah Link Utama
        </button>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-amber-900 border-b-2 border-amber-300 pb-2">
          Layanan Lain
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndLinks("service")}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={getSortedLinksByType("service").map(
              (item) => item._id || item.tempId
            )}
            strategy={verticalListSortingStrategy}
          >
            {getSortedLinksByType("service").map((item) => (
              <SortableLinkEditor
                key={item._id || item.tempId}
                id={item._id || item.tempId}
                item={item}
                onChange={handleChangeLink}
                onDelete={handleDeleteLink}
                forcedType="service"
                isDragging={isDragging}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button
          onClick={() => addNewLink("service")}
          className="w-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 rounded-lg mt-3 transition-all duration-200 border border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-md disabled:opacity-50"
        >
          + Tambah Layanan Lain
        </button>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-amber-900 border-b-2 border-amber-300 pb-2">
          Lain-lain
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndLinks("other")}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={getSortedLinksByType("other").map(
              (item) => item._id || item.tempId
            )}
            strategy={verticalListSortingStrategy}
          >
            {getSortedLinksByType("other").map((item) => (
              <SortableLinkEditor
                key={item._id || item.tempId}
                id={item._id || item.tempId}
                item={item}
                onChange={handleChangeLink}
                onDelete={handleDeleteLink}
                forcedType="other"
                isDragging={isDragging}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button
          onClick={() => addNewLink("other")}
          className="w-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 rounded-lg mt-3 transition-all duration-200 border border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-md disabled:opacity-50"
        >
          + Tambah Lain-lain
        </button>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-amber-900 border-b-2 border-amber-300 pb-2">
          Sosial Media (Urutan Dari Kiri ke Kanan)
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndSocials}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={sortedSocials.map((item) => item._id || item.tempId)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSocials.map((item) => (
              <SortableSocialEditor
                key={item._id || item.tempId}
                id={item._id || item.tempId}
                item={item}
                onChange={handleChangeSocial}
                onDelete={handleDeleteSocial}
                isDragging={isDragging}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button
          onClick={addNewSocial}
          className="w-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 rounded-lg mt-3 transition-all duration-200 border border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-md disabled:opacity-50"
        >
          + Tambah Social
        </button>

        <button
          onClick={handleSaveAll}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-lg mt-8 transition-all duration-200 shadow-md hover:shadow-lg text-lg"
        >
          💾 Simpan Semua Perubahan
        </button>

        <form onSubmit={handleLogout}>
          <button
            className="mt-6 w-full bg-amber-300 hover:bg-amber-400 text-amber-900 px-4 py-3 rounded-lg font-semibold transition-all duration-200 border border-amber-400 hover:border-amber-500"
            type="submit"
          >
            🚪 Logout
          </button>
        </form>
      </div>
    </div>
  );
}

function SortableLinkEditor({
  id,
  item,
  onChange,
  onDelete,
  forcedType,
  isDragging: globalIsDragging,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : "auto",
    marginBottom: "0.5rem",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <LinkEditor
        link={item}
        onChange={onChange}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        forcedType={forcedType}
        isDragging={globalIsDragging}
      />
    </div>
  );
}

function SortableSocialEditor({
  id,
  item,
  onChange,
  onDelete,
  isDragging: globalIsDragging,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : "auto",
    marginBottom: "0.5rem",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SocialEditor
        social={item}
        onChange={onChange}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={globalIsDragging}
      />
    </div>
  );
}
