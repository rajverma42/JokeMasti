export interface FestivalWish {
  festival: string;
  text: string;
}

export const festivalWishes: FestivalWish[] = [
  { festival: "diwali", text: "Is Diwali aapki zindagi mein itni roshni ho ki sunglasses pehnni pade! Happy Diwali! 🪔✨" },
  { festival: "diwali", text: "Diyo ki roshni, mithai ki meethas aur pataakon ka shor — Happy Diwali aapko aur aapke parivaar ko! 🎆" },
  { festival: "holi", text: "Is Holi rang toh sabke lagenge, bas apna favourite kurta bacha lena! Happy Holi! 🎨😄" },
  { festival: "holi", text: "Gulal ki tarah rangeen ho aapki zindagi, gujiya ki tarah meethi ho har khushi. Happy Holi! 🌈" },
  { festival: "raksha-bandhan", text: "Rakhi ka dhaaga kamzor hai, par bhai-behen ka pyaar sabse mazboot! Happy Raksha Bandhan! 🎗️" },
  { festival: "raksha-bandhan", text: "Is Rakhi thoda gift bhi zyada expect kar lena, hakk banta hai! Happy Raksha Bandhan! 🎁" },
  { festival: "independence-day", text: "Azaadi ka jashn manao, par WiFi ka password kisi se share mat karo — asli azaadi wahi hai! Happy Independence Day! 🇮🇳" },
  { festival: "independence-day", text: "15 August Mubarak — desh ke saath-saath aaj thodi chhutti bhi celebrate karo! 🇮🇳🎉" },
  { festival: "republic-day", text: "Republic Day Mubarak — aaj parade dekho, kal se phir wahi routine! 🎖️🇮🇳" },
  { festival: "republic-day", text: "26 January Special: desh bhakti ke saath thoda ghar ki safai bhi ho jaaye. Happy Republic Day! 🎖️" },
  { festival: "christmas", text: "Santa se milkar bolna, is baar wish list mein sirf ek achi cake hi kaafi hai! Merry Christmas! 🎄🎅" },
  { festival: "christmas", text: "Cake, carols aur thoda sa chaos — Merry Christmas aap sabko! 🎄✨" },
  { festival: "new-year", text: "Naya saal, nayi umeedein — aur wahi purana resolution jo 3 din mein tootega. Happy New Year! 🎆" },
  { festival: "new-year", text: "Is saal sirf ek resolution rakhna — zyada resolution mat banana! Happy New Year! 🥳" },
  { festival: "eid", text: "Eid Mubarak! Sewaiyan zyada khana, guilt kam rakhna — yehi asli Eid spirit hai. 🌙" },
  { festival: "eid", text: "Chaand raat ki khushiyan, sewaiyon ki meethas — Eid Mubarak aap sabko! 🌙✨" },
  { festival: "makar-sankranti", text: "Patang udhao, par doston ki dor kabhi mat kaato! Happy Makar Sankranti! 🪁" },
  { festival: "makar-sankranti", text: "Til-gud ki meethas, patango ka josh — Happy Makar Sankranti! 🪁🌞" },
  { festival: "navratri", text: "9 din vrat, aur baaki 356 din khaane ka plan — Happy Navratri! 🪘" },
  { festival: "navratri", text: "Garba ke steps bhool jaao, energy mat bhoolna! Happy Navratri! 💃" },
  { festival: "durga-puja", text: "Pandal hopping ka season aa gaya — comfortable chappal pehen ke nikalna! Happy Durga Puja! 🙏" },
  { festival: "durga-puja", text: "Dhak ki awaaz, pandal ki roshni — Shubho Durga Puja! 🙏✨" },
  { festival: "chhath-puja", text: "Chhath ki bhakti aur sabr ke aage sab kuch chhota hai — Happy Chhath Puja! 🌅" },
  { festival: "chhath-puja", text: "Surya bhagwan ka aashirwad sabpe bana rahe — Happy Chhath Puja! 🙏🌅" },
  { festival: "valentines-day", text: "Single ho ya committed, aaj toh sirf khud se pyaar karo! Happy Valentine's Day! 💘" },
  { festival: "valentines-day", text: "Pyaar ka din hai — chocolate khud ko bhi gift kar sakte ho! Happy Valentine's Day! 💝" },
  { festival: "friendship-day", text: "Dosti mein hisaab nahi hota, sirf trust hota hai — Happy Friendship Day yaar! 🤝" },
  { festival: "friendship-day", text: "Purane dost, nayi yaadein — Happy Friendship Day! 🧡" },
  { festival: "mothers-day", text: "Mummy, aaj ke din bhi “Aaj kya banaogi” nahi poochhunga, promise! Happy Mother's Day! 🌷" },
  { festival: "mothers-day", text: "Har din mummy ka din hona chahiye — Happy Mother's Day! 💐" },
  { festival: "fathers-day", text: "Papa, aapka gyaan free hai, par utna hi valuable! Happy Father's Day! 👔" },
  { festival: "fathers-day", text: "Silent pyaar, loud support — Happy Father's Day Papa! 🙌" },
];

export function getWishesByFestival(festival: string) {
  return festivalWishes.filter((w) => w.festival === festival);
}
