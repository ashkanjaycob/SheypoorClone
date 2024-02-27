

function Footer() {
  return (
    <footer className="bg-zinc-50 rtl">
      <div className="container mx-auto py-4 sm:py-6 lg:py-8">
        <div className="flex justify-between gap-20">
          {/* Column 1 */}
          <div>
            <h4 className="mb-3 text-lg">شیپور</h4>
            <ul className="space-y-2">
              <li><a href="#">درباره شیپور</a></li>
              <li><a href="#">بلاگ</a></li>
              <li><a href="#">نقشه سایت</a></li>
            </ul>
          </div>
          {/* Column 2 */}
          <div>
            <h4 className="mb-3 text-lg">راهنمای مشتریان</h4>
            <ul className="space-y-2">
              <li><a href="#">سوالات متداول</a></li>
              <li><a href="#">تماس با پشتیبانی</a></li>
              <li><a href="#">راهنما و پشتیبانی</a></li>
              <li><a href="#">قوانین و مقررات</a></li>
            </ul>
          </div>
          {/* Column 3 */}
          <div>
            <h4 className="mb-3 text-lg">خدمات</h4>
            <ul className="space-y-2">
              <li><a href="#">همه فروشگاه ها</a></li>
              <li><a href="#">همه فروشگاه ها</a></li>
              <li><a href="#">همه فروشگاه ها</a></li>
            </ul>
          </div>

        <div className="flex justufy-end">
        <div className="flex self-end flex-col gap-5 mt-4">
          {/* Buttons */}
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Button 1</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Button 2</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Button 3</button>
          </div>
        </div>


        </div>

      </div>
    </footer>
  );
}

export default Footer;
