import JSZip from "jszip";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function fetchBlobFromUrl(url: string): Promise<Blob> {
  const res = await fetch(url);
  return res.blob();
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Skin Pack (.mcpack) ───

export async function generateSkinPack(opts: {
  skinType: string; // "steve" | "alex"
  skinStyle: string;
  textureUrl: string | null;
}) {
  const zip = new JSZip();
  const packId = generateUUID();
  const skinId = generateUUID();
  const packName = `BlockCraft Skin - ${opts.skinStyle}`;

  // manifest.json
  zip.file(
    "manifest.json",
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: packName,
          description: `A custom ${opts.skinStyle} skin made with BlockCraft Studio!`,
          uuid: packId,
          version: [1, 0, 0],
          min_engine_version: [1, 16, 0],
        },
        modules: [
          {
            type: "skin_pack",
            uuid: generateUUID(),
            version: [1, 0, 0],
          },
        ],
      },
      null,
      2
    )
  );

  // skins.json
  const geometry = opts.skinType === "alex" ? "geometry.humanoid.customSlim" : "geometry.humanoid.custom";
  zip.file(
    "skins.json",
    JSON.stringify(
      {
        serialize_name: packName.replace(/\s/g, "_"),
        localization_name: packName.replace(/\s/g, "_"),
        skins: [
          {
            localization_name: skinId,
            geometry: geometry,
            texture: `${skinId}.png`,
            type: "free",
          },
        ],
      },
      null,
      2
    )
  );

  // Add texture — use uploaded or generate a placeholder
  if (opts.textureUrl) {
    const blob = await fetchBlobFromUrl(opts.textureUrl);
    zip.file(`${skinId}.png`, blob);
  } else {
    // Generate a simple 64x64 placeholder skin canvas
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const colors: Record<string, string> = {
      warrior: "#c0392b",
      explorer: "#27ae60",
      wizard: "#8e44ad",
      robot: "#7f8c8d",
      animal: "#e67e22",
      custom: "#3498db",
    };
    ctx.fillStyle = colors[opts.skinStyle] || "#3498db";
    ctx.fillRect(0, 0, 64, 64);
    // Head highlight
    ctx.fillStyle = "#ffffff44";
    ctx.fillRect(8, 8, 8, 8);
    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
    zip.file(`${skinId}.png`, blob);
  }

  // en_US.lang
  zip.file("texts/en_US.lang", `skin.${packName.replace(/\s/g, "_")}.${skinId}=${packName}\nskinpack.${packName.replace(/\s/g, "_")}=${packName}\n`);
  zip.file("texts/languages.json", JSON.stringify(["en_US"]));

  const content = await zip.generateAsync({ type: "blob" });
  triggerDownload(content, `${packName.replace(/\s/g, "_")}.mcpack`);
}

export async function generateSkinPackBlob(opts: {
  skinType: string;
  skinStyle: string;
  textureUrl: string | null;
}): Promise<Blob> {
  const zip = new JSZip();
  const packId = generateUUID();
  const skinId = generateUUID();
  const packName = `BlockCraft Skin - ${opts.skinStyle}`;
  zip.file("manifest.json", JSON.stringify({ format_version: 2, header: { name: packName, description: `A custom ${opts.skinStyle} skin made with BlockCraft Studio!`, uuid: packId, version: [1, 0, 0], min_engine_version: [1, 16, 0] }, modules: [{ type: "skin_pack", uuid: generateUUID(), version: [1, 0, 0] }] }, null, 2));
  const geometry = opts.skinType === "alex" ? "geometry.humanoid.customSlim" : "geometry.humanoid.custom";
  zip.file("skins.json", JSON.stringify({ serialize_name: packName.replace(/\s/g, "_"), localization_name: packName.replace(/\s/g, "_"), skins: [{ localization_name: skinId, geometry, texture: `${skinId}.png`, type: "free" }] }, null, 2));
  if (opts.textureUrl) {
    const blob = await fetchBlobFromUrl(opts.textureUrl);
    zip.file(`${skinId}.png`, blob);
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const colors: Record<string, string> = { warrior: "#c0392b", explorer: "#27ae60", wizard: "#8e44ad", robot: "#7f8c8d", animal: "#e67e22", custom: "#3498db" };
    ctx.fillStyle = colors[opts.skinStyle] || "#3498db";
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "#ffffff44";
    ctx.fillRect(8, 8, 8, 8);
    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
    zip.file(`${skinId}.png`, blob);
  }
  zip.file("texts/en_US.lang", `skin.${packName.replace(/\s/g, "_")}.${skinId}=${packName}\nskinpack.${packName.replace(/\s/g, "_")}=${packName}\n`);
  zip.file("texts/languages.json", JSON.stringify(["en_US"]));
  return zip.generateAsync({ type: "blob" });
}

// ─── Mod Pack (.mcaddon — wraps multiple .mcpack zips) ───

export async function generateModPack(opts: {
  packName: string;
  category: string;
  mods: string[];
  iconUrl: string | null;
}) {
  const outerZip = new JSZip();

  // For each selected mod, create a behavior pack .mcpack inside
  for (const mod of opts.mods) {
    const innerZip = new JSZip();
    const modId = generateUUID();

    innerZip.file(
      "manifest.json",
      JSON.stringify(
        {
          format_version: 2,
          header: {
            name: `${opts.packName} - ${mod}`,
            description: `${mod} module from ${opts.packName}`,
            uuid: modId,
            version: [1, 0, 0],
            min_engine_version: [1, 16, 0],
          },
          modules: [
            {
              type: "data",
              uuid: generateUUID(),
              version: [1, 0, 0],
            },
          ],
        },
        null,
        2
      )
    );

    // Add a placeholder behavior file
    innerZip.file(
      "functions/hello.mcfunction",
      `# ${mod} - Generated by BlockCraft Studio\nsay ${mod} loaded! Enjoy your ${opts.category} pack! 🎮\n`
    );

    if (opts.iconUrl) {
      const blob = await fetchBlobFromUrl(opts.iconUrl);
      innerZip.file("pack_icon.png", blob);
    }

    const innerBlob = await innerZip.generateAsync({ type: "blob" });
    outerZip.file(`${mod.replace(/\s/g, "_")}.mcpack`, innerBlob);
  }

  const content = await outerZip.generateAsync({ type: "blob" });
  triggerDownload(content, `${opts.packName.replace(/\s/g, "_")}.mcaddon`);
}

export async function generateModPackBlob(opts: {
  packName: string;
  category: string;
  mods: string[];
  iconUrl: string | null;
}): Promise<Blob> {
  const outerZip = new JSZip();
  for (const mod of opts.mods) {
    const innerZip = new JSZip();
    const modId = generateUUID();
    innerZip.file("manifest.json", JSON.stringify({ format_version: 2, header: { name: `${opts.packName} - ${mod}`, description: `${mod} module from ${opts.packName}`, uuid: modId, version: [1, 0, 0], min_engine_version: [1, 16, 0] }, modules: [{ type: "data", uuid: generateUUID(), version: [1, 0, 0] }] }, null, 2));
    innerZip.file("functions/hello.mcfunction", `# ${mod} - Generated by BlockCraft Studio\nsay ${mod} loaded! Enjoy your ${opts.category} pack! 🎮\n`);
    if (opts.iconUrl) {
      const blob = await fetchBlobFromUrl(opts.iconUrl);
      innerZip.file("pack_icon.png", blob);
    }
    outerZip.file(`${mod.replace(/\s/g, "_")}.mcpack`, await innerZip.generateAsync({ type: "blob" }));
  }
  return outerZip.generateAsync({ type: "blob" });
}

// ─── Add-on (.mcaddon with behavior + resource pack) ───

export async function generateAddon(opts: {
  addonName: string;
  addonType: string; // "behavior" | "resource" | "both"
  entityType: string;
  difficulty: string;
  textureUrl: string | null;
}) {
  const outerZip = new JSZip();

  const makePack = async (type: "data" | "resources", label: string) => {
    const pack = new JSZip();
    const packId = generateUUID();

    pack.file(
      "manifest.json",
      JSON.stringify(
        {
          format_version: 2,
          header: {
            name: `${opts.addonName} (${label})`,
            description: `Custom ${opts.entityType} add-on — ${opts.difficulty} difficulty. Made with BlockCraft Studio!`,
            uuid: packId,
            version: [1, 0, 0],
            min_engine_version: [1, 16, 0],
          },
          modules: [
            {
              type,
              uuid: generateUUID(),
              version: [1, 0, 0],
            },
          ],
        },
        null,
        2
      )
    );

    if (type === "data") {
      // Sample entity behavior
      const entityId = opts.addonName.toLowerCase().replace(/\s/g, "_");
      pack.file(
        `entities/${entityId}.json`,
        JSON.stringify(
          {
            format_version: "1.16.0",
            "minecraft:entity": {
              description: {
                identifier: `blockcraft:${entityId}`,
                is_spawnable: true,
                is_summonable: true,
              },
              components: {
                "minecraft:health": {
                  value: opts.difficulty === "easy" ? 10 : opts.difficulty === "medium" ? 20 : 40,
                  max: opts.difficulty === "easy" ? 10 : opts.difficulty === "medium" ? 20 : 40,
                },
                "minecraft:movement": { value: 0.25 },
                "minecraft:collision_box": { width: 0.6, height: 1.8 },
              },
            },
          },
          null,
          2
        )
      );
    }

    if (type === "resources" && opts.textureUrl) {
      const blob = await fetchBlobFromUrl(opts.textureUrl);
      pack.file("textures/entity/custom_entity.png", blob);
    }

    return pack;
  };

  if (opts.addonType === "behavior" || opts.addonType === "both") {
    const bp = await makePack("data", "Behavior");
    const bpBlob = await bp.generateAsync({ type: "blob" });
    outerZip.file("behavior_pack.mcpack", bpBlob);
  }

  if (opts.addonType === "resource" || opts.addonType === "both") {
    const rp = await makePack("resources", "Resource");
    const rpBlob = await rp.generateAsync({ type: "blob" });
    outerZip.file("resource_pack.mcpack", rpBlob);
  }

  const content = await outerZip.generateAsync({ type: "blob" });
  triggerDownload(content, `${opts.addonName.replace(/\s/g, "_")}.mcaddon`);
}

// Returns the blob without triggering a download (for publishing to store)
export async function generateAddonBlob(opts: {
  addonName: string;
  addonType: string;
  entityType: string;
  difficulty: string;
  textureUrl: string | null;
}): Promise<Blob> {
  const outerZip = new JSZip();

  const makePack = async (type: "data" | "resources", label: string) => {
    const pack = new JSZip();
    const packId = generateUUID();
    pack.file("manifest.json", JSON.stringify({
      format_version: 2,
      header: {
        name: `${opts.addonName} (${label})`,
        description: `Custom ${opts.entityType} add-on — ${opts.difficulty} difficulty. Made with BlockCraft Studio!`,
        uuid: packId, version: [1, 0, 0], min_engine_version: [1, 16, 0],
      },
      modules: [{ type, uuid: generateUUID(), version: [1, 0, 0] }],
    }, null, 2));

    if (type === "data") {
      const entityId = opts.addonName.toLowerCase().replace(/\s/g, "_");
      pack.file(`entities/${entityId}.json`, JSON.stringify({
        format_version: "1.16.0",
        "minecraft:entity": {
          description: { identifier: `blockcraft:${entityId}`, is_spawnable: true, is_summonable: true },
          components: {
            "minecraft:health": { value: opts.difficulty === "easy" ? 10 : opts.difficulty === "medium" ? 20 : 40, max: opts.difficulty === "easy" ? 10 : opts.difficulty === "medium" ? 20 : 40 },
            "minecraft:movement": { value: 0.25 },
            "minecraft:collision_box": { width: 0.6, height: 1.8 },
          },
        },
      }, null, 2));
    }

    if (type === "resources" && opts.textureUrl) {
      const blob = await fetchBlobFromUrl(opts.textureUrl);
      pack.file("textures/entity/custom_entity.png", blob);
    }
    return pack;
  };

  if (opts.addonType === "behavior" || opts.addonType === "both") {
    const bp = await makePack("data", "Behavior");
    outerZip.file("behavior_pack.mcpack", await bp.generateAsync({ type: "blob" }));
  }
  if (opts.addonType === "resource" || opts.addonType === "both") {
    const rp = await makePack("resources", "Resource");
    outerZip.file("resource_pack.mcpack", await rp.generateAsync({ type: "blob" }));
  }

  return outerZip.generateAsync({ type: "blob" });
}
