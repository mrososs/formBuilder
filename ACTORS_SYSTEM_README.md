# نظام Actors للـ Form Builder

## نظرة عامة

تم تطوير نظام Actors لتمكين صاحب الشركة من إدارة البيانات المحددة مسبقاً (Actors) واستخدامها في Form Builder. هذا النظام يحل محل نظام API Groups السابق ويوفر طريقة أكثر مرونة لإدارة البيانات.

## الميزات الرئيسية

### 🎯 **السيناريو المستهدف**

صاحب الشركة يقوم بإنشاء Actors (مصادر بيانات) قبل استخدام Form Builder، وعندما يختار dropdown أو multiselect أو radio buttons، يظهر له قائمة بهذه البيانات المحددة مسبقاً.

### 📊 **البيانات المحددة مسبقاً**

- **الموظفين** - قائمة بجميع موظفي الشركة
- **المدراء** - قائمة بجميع مدراء الشركة
- **الأقسام** - قائمة بجميع أقسام الشركة
- **المنتجات** - قائمة بجميع منتجات الشركة
- **العملاء** - قائمة بجميع عملاء الشركة
- **الموردين** - قائمة بجميع موردي الشركة
- **المواقع** - قائمة بجميع مواقع الشركة

## التغييرات الرئيسية

### 1. **نموذج الحقل المحدث**

```typescript
interface FormField {
  // ... الخصائص الموجودة ...

  // استبدال apiGroupId بـ actorId
  actorId?: string; // معرف Actor للاستخدام

  // تحديث optionSource
  optionSource?: "static" | "actors" | "custom" | "external";

  // ... باقي الخصائص ...
}
```

### 2. **خدمة Actors الجديدة**

```typescript
// src/app/services/actors-data.service.ts
export interface ActorData {
  id: string;
  name: string;
  description?: string;
  data: Array<{ value: string; label: string }>;
  category?: string;
  isActive?: boolean;
}
```

### 3. **إعدادات الحقل المحدثة**

الآن في Field Properties:

- **Option Source**: Static Options, Company Actors, External API, Custom Options
- **Company Actor**: قائمة بـ Actors المتاحة
- **Static Options**: خيارات ثابتة (comma-separated)
- **External API**: إعدادات API خارجية
- **Custom Options**: خيارات مخصصة (JSON)

## كيفية الاستخدام

### 1. **إعداد Actors**

```typescript
// إنشاء Actor جديد
const employeeActor: ActorData = {
  id: "employees",
  name: "الموظفين",
  description: "قائمة بجميع موظفي الشركة",
  category: "personnel",
  data: [
    { value: "emp_001", label: "أحمد محمد - مدير مبيعات" },
    { value: "emp_002", label: "فاطمة علي - محاسبة" },
    // ... المزيد
  ],
};
```

### 2. **استخدام Actors في الحقول**

```typescript
// Select Field مع Actors
const employeeSelectField: FormField = {
  id: "employee-select",
  type: "select",
  label: "اختر الموظف",
  required: true,
  optionSource: "actors",
  actorId: "employees",
};

// Multi-Select Field مع Actors
const productsMultiField: FormField = {
  id: "products-multi",
  type: "multiselect",
  label: "اختر المنتجات",
  required: false,
  optionSource: "actors",
  actorId: "products",
  maxSelections: 3,
};

// Radio Field مع Actors
const locationRadioField: FormField = {
  id: "location-radio",
  type: "radio",
  label: "اختر الموقع",
  required: true,
  optionSource: "actors",
  actorId: "locations",
  allowMultiple: false,
};
```

### 3. **إدارة Actors**

```typescript
// إضافة Actor جديد
actorsDataService.addActor(newActor);

// الحصول على خيارات Actor
actorsDataService.getActorOptions("employees").subscribe((options) => {
  console.log(options);
});

// تصدير بيانات Actors
const exportData = actorsDataService.exportActorsData();
```

## المكونات الجديدة

### 1. **ActorsManagementComponent**

مكون لإدارة Actors مع واجهة مستخدم كاملة:

- إضافة Actors جديدة
- تعديل Actors موجودة
- حذف Actors
- تصدير/استيراد البيانات
- عرض Actors حسب الفئات

### 2. **ActorsExampleComponent**

مكون مثال يوضح كيفية استخدام Actors في مختلف أنواع الحقول:

- Dropdown مع Actors
- Multi-Select مع Actors
- Radio Buttons مع Actors
- مقارنة مع Static Options

## التصدير والاستيراد

### JSON Export مع Actors

```typescript
// تصدير النموذج مع بيانات Actors
const exportData = {
  form: {
    // ... بيانات النموذج ...
    fields: [
      {
        // ... بيانات الحقل ...
        actorInfo: {
          actorId: "employees",
          actorName: "الموظفين",
          actorData: {
            /* بيانات Actor */
          },
        },
      },
    ],
  },
  actors: {
    // ... بيانات Actors ...
  },
  exportInfo: {
    exportedAt: "2024-01-01T00:00:00.000Z",
    version: "1.0",
    includesActors: true,
  },
};
```

### Angular Export مع Actors

```typescript
// توليد كود Angular مع Actors
export class EmployeeFormComponent implements OnInit {
  employeesOptions: Array<{ value: string; label: string }> = [];

  ngOnInit() {
    // تحميل خيارات الموظفين
    this.loadEmployeesOptions();
  }

  loadEmployeesOptions() {
    // تحميل بيانات الموظفين من service
    this.employeesOptions = this.actorsService.getEmployeesOptions();
  }
}
```

## الفئات (Categories)

### 1. **الموظفين والمدراء (Personnel)**

- الموظفين
- المدراء

### 2. **الهيكل التنظيمي (Organization)**

- الأقسام
- المواقع

### 3. **الأعمال (Business)**

- المنتجات
- العملاء
- الموردين

## المزايا

### ✅ **مزايا النظام الجديد**

1. **مرونة أكبر** - إمكانية إضافة Actors مخصصة
2. **إدارة أفضل** - واجهة مستخدم لإدارة Actors
3. **تصنيف منظم** - Actors مقسمة حسب الفئات
4. **تصدير شامل** - تضمين بيانات Actors في التصدير
5. **دعم متعدد اللغات** - واجهة عربية
6. **أداء محسن** - لا حاجة لـ API calls للبيانات المحلية

### 🔄 **الانتقال من النظام القديم**

```typescript
// النظام القديم
const oldField: FormField = {
  optionSource: "api",
  apiGroupId: "users",
};

// النظام الجديد
const newField: FormField = {
  optionSource: "actors",
  actorId: "employees",
};
```

## أفضل الممارسات

### 1. **تسمية Actors**

- استخدم أسماء واضحة ووصفية
- استخدم معرفات باللغة الإنجليزية
- أضف وصف مفصل لكل Actor

### 2. **تنظيم البيانات**

- قم بتصنيف Actors حسب الفئات
- حافظ على تناسق في تنسيق البيانات
- استخدم قيم فريدة للـ value

### 3. **إدارة الأداء**

- قلل من عدد العناصر في كل Actor
- استخدم pagination للبيانات الكبيرة
- احتفظ بالبيانات الأكثر استخداماً محلياً

## استكشاف الأخطاء

### مشاكل شائعة:

1. **Actor غير موجود**

   ```typescript
   // تأكد من وجود Actor
   const actor = actorsDataService.getActorData("employees");
   if (!actor) {
     console.error("Actor not found");
   }
   ```

2. **بيانات Actor فارغة**

   ```typescript
   // تحقق من البيانات
   const options = actorsDataService.getActorOptions("employees");
   if (options.length === 0) {
     console.warn("No options available");
   }
   ```

3. **خطأ في التصدير**
   ```typescript
   // تأكد من صحة البيانات قبل التصدير
   const exportData = actorsDataService.exportActorsData();
   if (!exportData.actors) {
     console.error("Invalid export data");
   }
   ```

## التطوير المستقبلي

### الميزات المخطط لها:

1. **API Integration** - ربط Actors مع APIs خارجية
2. **Real-time Updates** - تحديث البيانات في الوقت الفعلي
3. **Advanced Filtering** - تصفية متقدمة للبيانات
4. **Bulk Operations** - عمليات جماعية على البيانات
5. **Version Control** - التحكم في إصدارات البيانات

---

هذا النظام يوفر حلاً شاملاً ومتطوراً لإدارة البيانات في Form Builder، مما يسهل على صاحب الشركة إدارة بياناته واستخدامها بكفاءة في النماذج.
