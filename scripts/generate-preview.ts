import * as fs from "fs";
import * as path from "path";

const exportPath = path.resolve(__dirname, "../products_export.json");
const outputPath = path.resolve(__dirname, "../proposed_renames.json");

if (!fs.existsSync(exportPath)) {
  console.error("products_export.json not found!");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(exportPath, "utf-8"));
const renames = [];

for (const p of products) {
  let oldName = p.name;
  let newName = oldName;
  
  // Rule 1: HP Toners
  if (/Toner Pour HP P2015\/1320/i.test(newName)) newName = "Toner HP 53A (Q7553A) / 49A (Q5949A)";
  if (/Toner Pour HP1010\/1018 Canon LBP2900/i.test(newName)) newName = "Toner HP 12A (Q2612A) / Canon CRG-703";
  if (/Toner Pour HP 107a\/MFP135/i.test(newName)) newName = "Toner HP 106A (W1106A)";
  if (/Toner Pour HP 102A\/M130 Cznon LBP113/i.test(newName)) newName = "Toner HP 17A (CF217A) / Canon CRG-047";
  if (/Toner Pour Hp 2030\/2055 M400/i.test(newName)) newName = "Toner HP 05A (CE505A) / 80A (CF280A)";
  if (/Toner Pour HP 83A M128/i.test(newName)) newName = "Toner HP 83A (CF283A)";
  if (/Toner Pour HP M404\/MFP428/i.test(newName)) newName = "Toner HP 59A (CF259A)";
  if (/Toner Pour Canon\/HP M404\/M428/i.test(newName)) newName = "Toner HP 59A (CF259A) / Canon CRG-057";
  if (/Toner HP M12a\/M26a CF279A/i.test(newName)) newName = "Toner HP 79A (CF279A)";
  if (/Toner HP244A M15a\/M28a/i.test(newName)) newName = "Toner HP 44A (CF244A)";

  // Rule 2: Samsung Toners
  if (/Toner Pour Samsung SCX-4300/i.test(newName)) newName = "Toner Samsung MLT-D109S";
  if (/Toner Samsung MLT-104 Serie/i.test(newName)) newName = "Toner Samsung MLT-D104S";
  if (/Toner Samsung MLT-D111 Serie/i.test(newName)) newName = "Toner Samsung MLT-D111S";
  
  // Rule 3: Konica Minolta Toners
  if (/Toner Konika TN414 Origine/i.test(newName)) newName = "Toner Konica Minolta TN-414 (Original)";
  if (/Toner Konika TN217\/TN414/i.test(newName)) newName = "Toner Konica Minolta TN-217 / TN-414";
  if (/Toner Konika TN211/i.test(newName)) newName = "Toner Konica Minolta TN-211";
  
  // Rule 4: Lexmark
  if (/Toner Pour Lexmark \/350\/352/i.test(newName)) newName = "Toner Lexmark E250A11E / E352";

  // Rule 5: Inks
  if (/Encre Imprimante Canon Pixma G3430/i.test(newName)) newName = "Bouteille d'encre Canon GI-41";
  if (/Encre Imprimante Canon Pixma G3411/i.test(newName)) newName = "Bouteille d'encre Canon GI-490";
  if (/Encre Origine Imprimante Canon Pixma G3411/i.test(newName)) newName = "Bouteille d'encre Originale Canon GI-490";
  if (/Encre Epson 3100 Serie/i.test(newName)) newName = "Bouteille d'encre Epson 103";
  if (/Encre Epson T6641/i.test(newName)) newName = "Bouteille d'encre Epson T6641 (Noir)";
  if (/Encre Origine Epson 110/i.test(newName)) newName = "Bouteille d'encre Originale Epson 110";

  // Rule 6: Cartridges
  if (/Cartouche HP 653 Origine/i.test(newName)) newName = "Cartouche d'encre Originale HP 653";
  if (/Cartouche HP 650 Origine/i.test(newName)) newName = "Cartouche d'encre Originale HP 650";
  if (/Cartouche HP 121 Origine/i.test(newName)) newName = "Cartouche d'encre Originale HP 121";
  if (/Cartouche HP 122 Origine/i.test(newName)) newName = "Cartouche d'encre Originale HP 122";
  if (/Cartouche HP 652 Origine/i.test(newName)) newName = "Cartouche d'encre Originale HP 652";
  if (/Cartouche HP 123 Origine/i.test(newName)) newName = "Cartouche d'encre Originale HP 123";
  if (/Cartouche HP 305 Origine/i.test(newName)) newName = "Cartouche d'encre Originale HP 305";
  if (/Cartouche Canon 446 Origine/i.test(newName)) newName = "Cartouche d'encre Originale Canon 446";
  if (/Cartouche Canon 445 Origine/i.test(newName)) newName = "Cartouche d'encre Originale Canon 445";

  // Rule 7: EZVIZ Cameras (C1C-B, H6c, C3W, H3C are all EZVIZ models)
  if (/Camera Wifi Smart Home C1C-B/i.test(newName)) newName = "Caméra Wi-Fi EZVIZ C1C-B";
  if (/Camera Wifi Smart Home H6c/i.test(newName)) newName = "Caméra Wi-Fi EZVIZ H6c";
  if (/Camera Etanche Wifi H3C/i.test(newName)) newName = "Caméra Wi-Fi Extérieure EZVIZ H3c";
  if (/Camera Wifi C3W Coleur Vue Jour\/Nuit/i.test(newName)) newName = "Caméra Wi-Fi EZVIZ C3W Color Night Vision";

  // Rule 8: Accessories & Hardware
  if (/Geforce GT730 DDR3/i.test(newName)) newName = "Carte Graphique Nvidia GeForce GT 730 DDR3";
  if (/Clavier\+Souris Sans Fil HAVIC KB100/i.test(newName)) newName = "Clavier et Souris Sans Fil Havit KB100";
  if (/Appareil Tel Sans Fil Telefunken/i.test(newName)) newName = "Téléphone Sans Fil Telefunken";
  if (/Appareil Tel Sans Fil MOTOROLA/i.test(newName)) newName = "Téléphone Sans Fil Motorola";
  if (/Baffe Kisonli/i.test(newName)) newName = newName.replace(/Baffe Kisonli/i, "Haut-parleur Kisonli");
  if (/Baffe Jedel/i.test(newName)) newName = newName.replace(/Baffe Jedel/i, "Haut-parleur Jedel");

  // Rule 9: Antivirus
  if (/Kaspersky Antivirus Standard 03 Appareils/i.test(newName)) newName = "Kaspersky Standard 3 Appareils";
  if (/Kaspersky Antivirus Plus 03 Appareils/i.test(newName)) newName = "Kaspersky Plus 3 Appareils";
  if (/Kaspersky Antivirus Internet Securit.* 01 Appareils/i.test(newName)) newName = "Kaspersky Internet Security 1 Appareil";

  // Rule 10: Formatting Fixes
  newName = newName.replace(/Botier/i, "Boîtier");
  newName = newName.replace(/Cqsaue/i, "Casque");
  newName = newName.replace(/Soris/i, "Souris");
  newName = newName.replace(/S\.F /i, "Sans Fil ");
  newName = newName.replace(/Fil /i, "Filaire ");
  if (newName.includes("Souris Filaireaire")) newName = newName.replace("Souris Filaireaire", "Souris Filaire");

  if (newName !== oldName) {
    renames.push({
      id: p.id,
      category: p.category,
      price: p.price_mad + " MAD",
      old_name: oldName,
      new_name: newName
    });
  }
}

fs.writeFileSync(outputPath, JSON.stringify(renames, null, 2));
console.log(`Generated preview with ${renames.length} renames. File: proposed_renames.json`);
