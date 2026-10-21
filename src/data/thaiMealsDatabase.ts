// ============================================================
//  ฐานข้อมูลอาหารไทย 50 เมนู — พร้อม Safety Badge ต่อโรค
// ============================================================

export type DiseaseKey = 'CKD_4' | 'CKD_5' | 'HT' | 'DM' | 'DYSLIPIDEMIA' | 'GENERAL';
export type SafetyTag = 'green' | 'yellow' | 'red';

export interface ThaiMeal {
    id: string;
    name: string;
    nameTh: string;
    category: 'rice' | 'noodle' | 'soup' | 'curry' | 'stir-fry' | 'salad' | 'snack' | 'drink';
    calories: number;
    protein: number;
    sodium: number;
    potassium: number;
    phosphorus: number;
    cholesterol: number;
    fat: number;
    sfaGram: number;
    carbs: number;
    imageUrl?: string;
    safety: Record<DiseaseKey, SafetyTag>;
    notes?: Partial<Record<DiseaseKey, string>>;
}

export const THAI_MEALS_DATABASE: ThaiMeal[] = [
    {
        id: 'tm01', name: 'Steamed Rice', nameTh: 'ข้าวสวย 1 ทัพพี', category: 'rice',
        calories: 180, protein: 3, sodium: 2, potassium: 55, phosphorus: 68,
        cholesterol: 0, fat: 0.4, sfaGram: 0.1, carbs: 39,
        safety: { CKD_4: 'green', CKD_5: 'yellow', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_5: 'จำกัดปริมาณ K+ สะสม', DM: 'ควบคุมปริมาณ — คาร์บสูง' }
    },
    {
        id: 'tm02', name: 'Basil Chicken Fried Egg', nameTh: 'กะเพราไก่ไข่ดาว', category: 'stir-fry',
        calories: 520, protein: 30, sodium: 820, potassium: 450, phosphorus: 280,
        cholesterol: 245, fat: 22, sfaGram: 5.5, carbs: 42,
        imageUrl: 'https://assets.unileversolutions.com/recipes-v2/242153.jpg',
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
        notes: { CKD_4: 'โซเดียม 820mg — ต้องนับรวมกับมื้ออื่น', CKD_5: 'โซเดียมและฟอสฟอรัสสูงเกิน', HT: 'ลดซีอิ๊ว/น้ำปลาลง 50%' }
    },
    {
        id: 'tm03', name: 'Steamed Chicken Rice', nameTh: 'ข้าวมันไก่', category: 'rice',
        calories: 480, protein: 28, sodium: 540, potassium: 380, phosphorus: 240,
        cholesterol: 85, fat: 14, sfaGram: 3.5, carbs: 58,
        safety: { CKD_4: 'green', CKD_5: 'yellow', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { HT: 'หลีกเลี่ยงน้ำจิ้ม — โซเดียมสูง' }
    },
    {
        id: 'tm04', name: 'Roasted Duck Rice', nameTh: 'ข้าวหน้าเป็ด', category: 'rice',
        calories: 560, protein: 25, sodium: 980, potassium: 420, phosphorus: 260,
        cholesterol: 120, fat: 26, sfaGram: 8.5, carbs: 55,
        safety: { CKD_4: 'red', CKD_5: 'red', HT: 'red', DM: 'yellow', DYSLIPIDEMIA: 'red', GENERAL: 'yellow' },
        notes: { CKD_4: 'โซเดียมและไขมันสูงมาก — ไม่แนะนำ', DYSLIPIDEMIA: 'ไขมันอิ่มตัว 8.5g เกินขีดจำกัด' }
    },
    {
        id: 'tm05', name: 'Garlic Pepper Pork', nameTh: 'หมูผัดกระเทียมพริกไทย', category: 'stir-fry',
        calories: 380, protein: 25, sodium: 650, potassium: 380, phosphorus: 210,
        cholesterol: 75, fat: 18, sfaGram: 4.5, carbs: 20,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
        notes: { CKD_4: 'โปรตีนปานกลาง — นับ quota', HT: 'ลดซีอิ๊วขาว' }
    },
    {
        id: 'tm06', name: 'Pad Thai', nameTh: 'ผัดไทยกุ้งสด', category: 'noodle',
        calories: 520, protein: 22, sodium: 890, potassium: 320, phosphorus: 220,
        cholesterol: 180, fat: 18, sfaGram: 3.5, carbs: 65,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
        notes: { CKD_4: 'โซเดียมสูง — ลดน้ำปลา+ซอสหอยนางรม', CKD_5: 'กุ้งมีฟอสฟอรัสสูง' }
    },
    {
        id: 'tm07', name: 'Boat Noodles', nameTh: 'ก๋วยเตี๋ยวเรือเนื้อ', category: 'noodle',
        calories: 310, protein: 18, sodium: 1100, potassium: 290, phosphorus: 180,
        cholesterol: 45, fat: 8, sfaGram: 2.5, carbs: 42,
        safety: { CKD_4: 'red', CKD_5: 'red', HT: 'red', DM: 'yellow', DYSLIPIDEMIA: 'yellow', GENERAL: 'yellow' },
        notes: { CKD_4: 'น้ำซุปโซเดียมสูงมาก 1100mg', HT: 'ห้ามดื่มน้ำซุป' }
    },
    {
        id: 'tm08', name: 'Clear Pork Noodle Soup', nameTh: 'ก๋วยเตี๋ยวน้ำใสหมู', category: 'noodle',
        calories: 290, protein: 16, sodium: 680, potassium: 240, phosphorus: 160,
        cholesterol: 40, fat: 5, sfaGram: 1.5, carbs: 45,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'ขอลดน้ำปลา — เลือกน้ำใสไม่ใส่ซุปก้น' }
    },
    {
        id: 'tm09', name: 'BBQ Pork Noodles', nameTh: 'บะหมี่หมูแดง', category: 'noodle',
        calories: 420, protein: 20, sodium: 760, potassium: 280, phosphorus: 195,
        cholesterol: 55, fat: 12, sfaGram: 3.0, carbs: 55,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
    },
    {
        id: 'tm10', name: 'Glass Noodle Soup', nameTh: 'วุ้นเส้นน้ำใส', category: 'noodle',
        calories: 220, protein: 10, sodium: 580, potassium: 200, phosphorus: 120,
        cholesterol: 25, fat: 4, sfaGram: 1.0, carbs: 38,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'วุ้นเส้นฟอสฟอรัสต่ำ — ดีกว่าก๋วยเตี๋ยวสำหรับ CKD' }
    },
    {
        id: 'tm11', name: 'Tom Kha Gai', nameTh: 'ต้มข่าไก่', category: 'soup',
        calories: 320, protein: 18, sodium: 580, potassium: 390, phosphorus: 190,
        cholesterol: 55, fat: 20, sfaGram: 14.5, carbs: 12,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'red', GENERAL: 'yellow' },
        notes: { DYSLIPIDEMIA: 'กะทิมีไขมันอิ่มตัวสูงมาก — ไม่แนะนำ' }
    },
    {
        id: 'tm12', name: 'Tom Yum Kung Clear', nameTh: 'ต้มยำกุ้งน้ำใส', category: 'soup',
        calories: 160, protein: 18, sodium: 580, potassium: 380, phosphorus: 280,
        cholesterol: 135, fat: 5, sfaGram: 1.0, carbs: 8,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_5: 'กุ้งมีฟอสฟอรัสและ K+ สูง', CKD_4: 'ระวังโซเดียมสะสม' }
    },
    {
        id: 'tm13', name: 'Clear Tofu Pork Soup', nameTh: 'ต้มจืดเต้าหู้หมูสับ', category: 'soup',
        calories: 150, protein: 12, sodium: 300, potassium: 240, phosphorus: 140,
        cholesterol: 30, fat: 6, sfaGram: 1.5, carbs: 8,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'เมนูแนะนำสำหรับโรคไต — โซเดียมต่ำมาก' }
    },
    {
        id: 'tm14', name: 'Green Curry Chicken', nameTh: 'แกงเขียวหวานไก่', category: 'curry',
        calories: 380, protein: 22, sodium: 720, potassium: 480, phosphorus: 230,
        cholesterol: 75, fat: 22, sfaGram: 15.0, carbs: 18,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'red', GENERAL: 'yellow' },
        notes: { DYSLIPIDEMIA: 'กะทิไขมันสูงมาก', CKD_5: 'K+ และ P สูง' }
    },
    {
        id: 'tm15', name: 'Massaman Beef Curry', nameTh: 'แกงมัสมั่นเนื้อ', category: 'curry',
        calories: 450, protein: 24, sodium: 680, potassium: 520, phosphorus: 270,
        cholesterol: 80, fat: 26, sfaGram: 17.0, carbs: 28,
        safety: { CKD_4: 'red', CKD_5: 'red', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'red', GENERAL: 'yellow' },
        notes: { DYSLIPIDEMIA: 'ไขมันอิ่มตัว 17g — เกินขีดจำกัดรายวัน', CKD_4: 'K+ และ P สูงมาก' }
    },
    {
        id: 'tm16', name: 'Tom Saap Pork', nameTh: 'ต้มแซ่บซี่โครงหมู', category: 'soup',
        calories: 240, protein: 20, sodium: 650, potassium: 420, phosphorus: 200,
        cholesterol: 60, fat: 10, sfaGram: 3.5, carbs: 10,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
    },
    {
        id: 'tm17', name: 'Yellow Curry Chicken', nameTh: 'แกงกะหรี่ไก่', category: 'curry',
        calories: 360, protein: 22, sodium: 640, potassium: 460, phosphorus: 215,
        cholesterol: 70, fat: 20, sfaGram: 12.0, carbs: 22,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'red', GENERAL: 'yellow' },
    },
    {
        id: 'tm18', name: 'Stir-fried Mixed Vegetables', nameTh: 'ผัดผักรวม', category: 'stir-fry',
        calories: 180, protein: 6, sodium: 420, potassium: 520, phosphorus: 90,
        cholesterol: 0, fat: 10, sfaGram: 1.5, carbs: 18,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_5: 'ผักรวมมีโพแทสเซียมสูง — เลือกผักต้มแทน' }
    },
    {
        id: 'tm19', name: 'Stir-fried Morning Glory', nameTh: 'ผัดผักบุ้งไฟแดง', category: 'stir-fry',
        calories: 160, protein: 5, sodium: 650, potassium: 480, phosphorus: 85,
        cholesterol: 0, fat: 10, sfaGram: 1.5, carbs: 12,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'โพแทสเซียมสูง — จำกัดปริมาณ', HT: 'ลดซีอิ๊วและน้ำมันหอย' }
    },
    {
        id: 'tm20', name: 'Fried Egg', nameTh: 'ไข่ดาว', category: 'stir-fry',
        calories: 90, protein: 6, sodium: 70, potassium: 70, phosphorus: 100,
        cholesterol: 185, fat: 7, sfaGram: 2.0, carbs: 0.5,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
        notes: { CKD_4: 'ทานได้ 1 ฟองต่อมื้อ', DYSLIPIDEMIA: 'คอเลสเตอรอล 185mg' }
    },
    {
        id: 'tm21', name: 'Boiled Egg', nameTh: 'ไข่ต้ม', category: 'snack',
        calories: 77, protein: 6, sodium: 62, potassium: 68, phosphorus: 95,
        cholesterol: 186, fat: 5, sfaGram: 1.6, carbs: 0.6,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
        notes: { CKD_4: 'ไข่ขาวต้มดีกว่า — ฟอสฟอรัสต่ำกว่า' }
    },
    {
        id: 'tm22', name: 'Tofu Stir-fry', nameTh: 'เต้าหู้ผัดผัก', category: 'stir-fry',
        calories: 200, protein: 14, sodium: 380, potassium: 320, phosphorus: 150,
        cholesterol: 0, fat: 12, sfaGram: 2.0, carbs: 10,
        safety: { CKD_4: 'green', CKD_5: 'yellow', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_5: 'เต้าหู้มีฟอสฟอรัส — จำกัดปริมาณ' }
    },
    {
        id: 'tm23', name: 'Fried Chicken No Skin', nameTh: 'ไก่ทอดไม่มีหนัง', category: 'stir-fry',
        calories: 210, protein: 26, sodium: 320, potassium: 320, phosphorus: 200,
        cholesterol: 80, fat: 10, sfaGram: 2.5, carbs: 4,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'โปรตีนสูง — นับ quota', CKD_5: 'เกิน protein quota CKD5' }
    },
    {
        id: 'tm24', name: 'Stir-fried Cabbage', nameTh: 'กะหล่ำปลีผัดน้ำมันหอย', category: 'stir-fry',
        calories: 130, protein: 4, sodium: 520, potassium: 220, phosphorus: 60,
        cholesterol: 0, fat: 8, sfaGram: 1.2, carbs: 10,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { HT: 'น้ำมันหอยมีโซเดียมสูง — ลดปริมาณ' }
    },
    {
        id: 'tm25', name: 'Thai Omelette', nameTh: 'ไข่เจียว', category: 'stir-fry',
        calories: 180, protein: 10, sodium: 280, potassium: 120, phosphorus: 165,
        cholesterol: 350, fat: 14, sfaGram: 3.5, carbs: 2,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'red', GENERAL: 'yellow' },
        notes: { DYSLIPIDEMIA: 'คอเลสเตอรอลสูงมาก 350mg — เกินโควต้า' }
    },
    {
        id: 'tm26', name: 'Som Tum', nameTh: 'ส้มตำไทย', category: 'salad',
        calories: 80, protein: 3, sodium: 580, potassium: 350, phosphorus: 70,
        cholesterol: 0, fat: 1, sfaGram: 0.2, carbs: 16,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'น้ำปลา+ปูดอง — โซเดียมสูง ลดปลาร้า', CKD_5: 'K+ ในมะละกอและมะเขือเทศ' }
    },
    {
        id: 'tm27', name: 'Glass Noodle Salad', nameTh: 'ยำวุ้นเส้น', category: 'salad',
        calories: 200, protein: 12, sodium: 680, potassium: 280, phosphorus: 130,
        cholesterol: 60, fat: 5, sfaGram: 1.0, carbs: 28,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
    },
    {
        id: 'tm28', name: 'Larb Moo', nameTh: 'ลาบหมู', category: 'salad',
        calories: 280, protein: 20, sodium: 720, potassium: 420, phosphorus: 190,
        cholesterol: 65, fat: 14, sfaGram: 4.5, carbs: 18,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'yellow', DM: 'green', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
    },
    {
        id: 'tm29', name: 'Rice Porridge', nameTh: 'โจ๊กหมูสับ', category: 'rice',
        calories: 220, protein: 14, sodium: 580, potassium: 180, phosphorus: 130,
        cholesterol: 35, fat: 6, sfaGram: 2.0, carbs: 28,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'yellow', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'โจ๊กน้ำใส — เหมาะมากสำหรับโรคไต', DM: 'GI สูง — ระวังน้ำตาลหลังอาหาร' }
    },
    {
        id: 'tm30', name: 'Fish Rice Soup', nameTh: 'ข้าวต้มปลา', category: 'rice',
        calories: 200, protein: 18, sodium: 450, potassium: 250, phosphorus: 200,
        cholesterol: 45, fat: 4, sfaGram: 1.0, carbs: 24,
        safety: { CKD_4: 'green', CKD_5: 'yellow', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'ปลาโปรตีนดี และ omega-3 ดีสำหรับไต' }
    },
    {
        id: 'tm31', name: 'Banana', nameTh: 'กล้วยน้ำว้า 1 ผล', category: 'snack',
        calories: 89, protein: 1.1, sodium: 1, potassium: 358, phosphorus: 22,
        cholesterol: 0, fat: 0.3, sfaGram: 0.1, carbs: 23,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_5: 'โพแทสเซียมสูงมาก 358mg — ห้ามสำหรับ CKD5', CKD_4: 'จำกัด 1 ผลต่อวัน' }
    },
    {
        id: 'tm32', name: 'Apple', nameTh: 'แอปเปิ้ล 1 ลูก', category: 'snack',
        calories: 95, protein: 0.5, sodium: 2, potassium: 195, phosphorus: 20,
        cholesterol: 0, fat: 0.3, sfaGram: 0.0, carbs: 25,
        safety: { CKD_4: 'green', CKD_5: 'yellow', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'ผลไม้โพแทสเซียมต่ำ — เหมาะสำหรับ CKD' }
    },
    {
        id: 'tm33', name: 'Guava', nameTh: 'ฝรั่ง 1 ผล', category: 'snack',
        calories: 68, protein: 2.5, sodium: 2, potassium: 417, phosphorus: 40,
        cholesterol: 0, fat: 1.0, sfaGram: 0.3, carbs: 14,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_5: 'โพแทสเซียมสูง 417mg' }
    },
    {
        id: 'tm34', name: 'Egg White Omelette', nameTh: 'ไข่ขาวเจียว', category: 'stir-fry',
        calories: 70, protein: 10, sodium: 110, potassium: 130, phosphorus: 20,
        cholesterol: 0, fat: 2.5, sfaGram: 0.5, carbs: 1,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'ฟอสฟอรัสต่ำมาก — เหมาะ CKD ทุก stage' }
    },
    {
        id: 'tm35', name: 'Steamed Fish Lime', nameTh: 'ปลานึ่งมะนาว', category: 'stir-fry',
        calories: 180, protein: 28, sodium: 380, potassium: 420, phosphorus: 240,
        cholesterol: 70, fat: 4, sfaGram: 0.8, carbs: 5,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'โปรตีนสูง — นับ quota อย่างระวัง', CKD_5: 'ฟอสฟอรัสสูง 240mg' }
    },
    {
        id: 'tm36', name: 'Low-Sodium Basil Chicken', nameTh: 'กะเพราไก่ลดโซเดียม', category: 'stir-fry',
        calories: 320, protein: 25, sodium: 180, potassium: 380, phosphorus: 200,
        cholesterol: 75, fat: 14, sfaGram: 3.0, carbs: 18,
        safety: { CKD_4: 'green', CKD_5: 'yellow', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'สูตรปรับพิเศษ — ลดโซเดียม 78% จากต้นฉบับ' }
    },
    {
        id: 'tm37', name: 'Brown Rice', nameTh: 'ข้าวกล้อง 1 ทัพพี', category: 'rice',
        calories: 170, protein: 4, sodium: 5, potassium: 77, phosphorus: 100,
        cholesterol: 0, fat: 1.5, sfaGram: 0.3, carbs: 35,
        safety: { CKD_4: 'yellow', CKD_5: 'yellow', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { DM: 'GI ต่ำกว่าข้าวขาว — เหมาะสำหรับเบาหวาน', CKD_4: 'ฟอสฟอรัสสูงกว่าข้าวขาว' }
    },
    {
        id: 'tm38', name: 'Bean Sprout Stir-fry', nameTh: 'ถั่วงอกผัด', category: 'stir-fry',
        calories: 85, protein: 4, sodium: 240, potassium: 180, phosphorus: 55,
        cholesterol: 0, fat: 5, sfaGram: 0.8, carbs: 7,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
    },
    {
        id: 'tm39', name: 'Boiled Chicken Breast', nameTh: 'อกไก่ต้มสุก', category: 'stir-fry',
        calories: 165, protein: 31, sodium: 74, potassium: 256, phosphorus: 220,
        cholesterol: 85, fat: 3.6, sfaGram: 1.0, carbs: 0,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'โปรตีนสูงมาก 31g — นับ quota อย่างเคร่ง', CKD_5: 'เกิน protein quota CKD5' }
    },
    {
        id: 'tm40', name: 'Bitter Gourd Egg', nameTh: 'มะระผัดไข่', category: 'stir-fry',
        calories: 150, protein: 8, sodium: 320, potassium: 290, phosphorus: 110,
        cholesterol: 185, fat: 9, sfaGram: 2.0, carbs: 8,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
        notes: { DM: 'มะระช่วยลดน้ำตาลในเลือด — เหมาะสำหรับเบาหวาน' }
    },
    {
        id: 'tm41', name: 'Thai Milk Tea', nameTh: 'ชาไทยใส่นม', category: 'drink',
        calories: 180, protein: 3, sodium: 80, potassium: 160, phosphorus: 80,
        cholesterol: 10, fat: 4, sfaGram: 2.5, carbs: 35,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'yellow', DM: 'red', DYSLIPIDEMIA: 'yellow', GENERAL: 'yellow' },
        notes: { DM: 'น้ำตาลสูงมาก — ห้ามสำหรับเบาหวาน', CKD_5: 'นมมีฟอสฟอรัสสูง' }
    },
    {
        id: 'tm42', name: 'Coconut Water', nameTh: 'น้ำมะพร้าวอ่อน', category: 'drink',
        calories: 45, protein: 1.7, sodium: 25, potassium: 600, phosphorus: 48,
        cholesterol: 0, fat: 0.5, sfaGram: 0.4, carbs: 9,
        safety: { CKD_4: 'red', CKD_5: 'red', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'โพแทสเซียมสูงมาก 600mg — ห้ามสำหรับโรคไต', HT: 'K+ สูง — ดีสำหรับความดัน' }
    },
    {
        id: 'tm43', name: 'Green Smoothie', nameTh: 'สมูทตี้ผักใบเขียว', category: 'drink',
        calories: 80, protein: 3, sodium: 35, potassium: 380, phosphorus: 55,
        cholesterol: 0, fat: 1, sfaGram: 0.2, carbs: 14,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'ผักใบเขียว — ระวัง Warfarin interaction', CKD_5: 'K+ สูง' }
    },
    {
        id: 'tm44', name: 'Plain Water 500ml', nameTh: 'น้ำเปล่า 500ml', category: 'drink',
        calories: 0, protein: 0, sodium: 0, potassium: 0, phosphorus: 0,
        cholesterol: 0, fat: 0, sfaGram: 0, carbs: 0,
        safety: { CKD_4: 'green', CKD_5: 'yellow', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_5: 'CKD5 บางรายจำเป็นต้องจำกัดน้ำ — ปรึกษาแพทย์' }
    },
    {
        id: 'tm45', name: 'Steamed Dumpling', nameTh: 'ขนมจีบไก่นึ่ง (ไม่มีซอส)', category: 'snack',
        calories: 60, protein: 4, sodium: 110, potassium: 60, phosphorus: 45,
        cholesterol: 15, fat: 2, sfaGram: 0.5, carbs: 8,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
    },
    {
        id: 'tm46', name: 'Sticky Rice', nameTh: 'ข้าวเหนียว 1 กำมือ', category: 'rice',
        calories: 170, protein: 3.5, sodium: 2, potassium: 40, phosphorus: 55,
        cholesterol: 0, fat: 0.4, sfaGram: 0.1, carbs: 37,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'yellow', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { DM: 'GI สูง — ระวังน้ำตาล', CKD_4: 'โพแทสเซียมต่ำมาก — เหมาะสำหรับ CKD' }
    },
    {
        id: 'tm47', name: 'Steamed Pumpkin', nameTh: 'ฟักทองนึ่ง', category: 'snack',
        calories: 49, protein: 1.8, sodium: 2, potassium: 340, phosphorus: 44,
        cholesterol: 0, fat: 0.2, sfaGram: 0.1, carbs: 12,
        safety: { CKD_4: 'yellow', CKD_5: 'red', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_5: 'โพแทสเซียมสูง 340mg' }
    },
    {
        id: 'tm48', name: 'Low-Sodium Cabbage Soup', nameTh: 'ซุปกะหล่ำปลีไม่เค็ม', category: 'soup',
        calories: 60, protein: 3, sodium: 120, potassium: 180, phosphorus: 40,
        cholesterol: 0, fat: 2, sfaGram: 0.3, carbs: 8,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'กะหล่ำปลี K+ ต่ำ — เมนูแนะนำสำหรับ CKD ทุก stage' }
    },
    {
        id: 'tm49', name: 'Chayote Egg Stir-fry', nameTh: 'ฟักแม้วผัดไข่', category: 'stir-fry',
        calories: 110, protein: 6, sodium: 260, potassium: 120, phosphorus: 75,
        cholesterol: 90, fat: 6, sfaGram: 1.5, carbs: 9,
        safety: { CKD_4: 'green', CKD_5: 'green', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'yellow', GENERAL: 'green' },
        notes: { CKD_4: 'ฟักแม้ว K+ ต่ำมาก — เหมาะสำหรับ CKD' }
    },
    {
        id: 'tm50', name: 'Low-Sodium Tom Yum Chicken', nameTh: 'ต้มยำไก่น้ำใสลดโซเดียม', category: 'soup',
        calories: 120, protein: 15, sodium: 280, potassium: 280, phosphorus: 150,
        cholesterol: 45, fat: 3, sfaGram: 0.8, carbs: 5,
        safety: { CKD_4: 'green', CKD_5: 'yellow', HT: 'green', DM: 'green', DYSLIPIDEMIA: 'green', GENERAL: 'green' },
        notes: { CKD_4: 'สูตรลดโซเดียม — ใช้เห็ดแทนกุ้ง ลดฟอสฟอรัสด้วย' }
    },
];

// Helper Functions
export function getMealSafetyForDisease(meal: ThaiMeal, diseaseKey: DiseaseKey): SafetyTag {
    return meal.safety[diseaseKey] ?? meal.safety.GENERAL;
}

export function getMealNote(meal: ThaiMeal, diseaseKey: DiseaseKey): string | undefined {
    return meal.notes?.[diseaseKey];
}

export function searchMeals(query: string): ThaiMeal[] {
    const q = query.toLowerCase().trim();
    if (!q) return THAI_MEALS_DATABASE;
    return THAI_MEALS_DATABASE.filter(m =>
        m.nameTh.includes(q) || m.name.toLowerCase().includes(q)
    );
}

export function getSafeMealsForDisease(diseaseKey: DiseaseKey): ThaiMeal[] {
    return THAI_MEALS_DATABASE.filter(m => m.safety[diseaseKey] !== 'red');
}

export function mapDiseaseToKey(disease: string): DiseaseKey {
    const map: Record<string, DiseaseKey> = {
        'CKD_4': 'CKD_4', 'CKD_STAGE_4': 'CKD_4', 'CKD STAGE_4': 'CKD_4',
        'CKD_5': 'CKD_5', 'CKD_STAGE_5': 'CKD_5', 'CKD STAGE_5': 'CKD_5',
        'HT': 'HT', 'ความดันโลหิตสูง': 'HT',
        'DM': 'DM', 'DM Type 2': 'DM', 'เบาหวาน Type 2': 'DM', 'เบาหวาน': 'DM',
        'DYSLIPIDEMIA': 'DYSLIPIDEMIA', 'ไขมันในเลือดสูง': 'DYSLIPIDEMIA',
    };
    return map[disease] ?? 'GENERAL';
}
