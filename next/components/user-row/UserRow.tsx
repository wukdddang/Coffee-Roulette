// UserRow 컴포넌트
type Props = {
  name: string;
  profileImg: any;
  weight: number;
};

const UserRow = ({ name, profileImg, weight }: Props) => (
  <tr>
    <th scope="row">
      <input type="checkbox" id={name} className="tech7" />
    </th>
    <td>
      <label htmlFor={name}>
        <img
          src={`/public/imgs/${profileImg ? name : "default-user"}.png`}
          width="20px"
          height="20px"
        />
        <span>{name}</span>
      </label>
    </td>
    <td>
      <span className={`${name} ratio`}>{weight}</span>
    </td>
    <td>
      <button className="plus btn btn-primary btn-sm ms-2">＋</button>
      <button className="minus btn btn-outline-primary btn-sm">－</button>
    </td>
  </tr>
);
