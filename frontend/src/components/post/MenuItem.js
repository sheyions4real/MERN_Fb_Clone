export default function MenuItem({ img, icon, title, subtitle }) {
  return (
    <li className="hover1">
      {img ? <img src={img} alt="" /> : <i className={`${icon}`}></i>}
      <div className="post_menu_text">
        <span>{title}</span>
        {subtitle && <span className="menu_post_col">{subtitle}</span>}
      </div>
    </li>
  );
}
