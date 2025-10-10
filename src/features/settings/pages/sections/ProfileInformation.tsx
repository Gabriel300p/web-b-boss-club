import { CheckIcon, PencilSimpleIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { BarbershopProfile } from "../../types/settings.types";

interface ProfileInformationProps {
  profile: BarbershopProfile;
  onSave?: (data: Partial<BarbershopProfile>) => void;
}

export function ProfileInformation({
  profile,
  onSave,
}: ProfileInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  const handleChange = (field: keyof BarbershopProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fields = [
    { label: "Nome", key: "name" as const, fullWidth: false },
    { label: "Data de início", key: "startDate" as const, fullWidth: false },
    { label: "E-mail", key: "email" as const, fullWidth: false },
    { label: "Telefone", key: "phone" as const, fullWidth: false },
    {
      label: "Link de agendamento",
      key: "bookingLink" as const,
      fullWidth: false,
    },
    {
      label: "Total de atendimentos",
      key: "totalAppointments" as const,
      fullWidth: false,
      readOnly: true,
    },
    { label: "URL Site", key: "websiteUrl" as const, fullWidth: false },
    {
      label: "Total de barbeiros",
      key: "totalBarbers" as const,
      fullWidth: false,
      readOnly: true,
    },
    { label: "Descrição", key: "description" as const, fullWidth: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Informações
        </h3>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.button
              key="edit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              <PencilSimpleIcon size={18} weight="bold" />
              Editar
            </motion.button>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
              >
                <XIcon size={18} weight="bold" />
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <CheckIcon size={18} weight="bold" />
                Salvar
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fields Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((field, index) => {
          const value =
            typeof formData[field.key] === "number"
              ? formData[field.key].toString()
              : formData[field.key];

          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={field.fullWidth ? "sm:col-span-2" : ""}
            >
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {field.label}
              </label>

              <AnimatePresence mode="wait">
                {!isEditing || field.readOnly ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-lg bg-neutral-50 px-4 py-3 text-neutral-900 dark:bg-neutral-900/50 dark:text-white ${
                      field.readOnly ? "font-medium" : ""
                    }`}
                  >
                    {value}
                  </motion.div>
                ) : field.fullWidth ? (
                  <motion.textarea
                    key="edit-textarea"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={3}
                    className="focus:border-primary-500 focus:ring-primary-500/20 dark:focus:border-primary-400 w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition-all focus:ring-2 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                  />
                ) : (
                  <motion.input
                    key="edit-input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="focus:border-primary-500 focus:ring-primary-500/20 dark:focus:border-primary-400 w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition-all focus:ring-2 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
