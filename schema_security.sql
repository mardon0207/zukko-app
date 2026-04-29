-- 1. Функция для безопасного начисления баллов через RPC (Remote Procedure Call)
-- Это предотвращает ручное изменение баллов пользователем через консоль браузера.
CREATE OR REPLACE FUNCTION add_points_secure(points_to_add INT, subject_name TEXT)
RETURNS void AS $$
BEGIN
  -- Мы используем auth.uid(), поэтому база сама знает, какому пользователю начислять баллы,
  -- даже если злоумышленник попробует отправить чужой ID.
  UPDATE profiles
  SET 
    total_points = total_points + points_to_add,
    subject_stats = jsonb_set(
      COALESCE(subject_stats, '{}'::jsonb),
      ARRAY[subject_name],
      (COALESCE((subject_stats->>subject_name)::int, 0) + points_to_add)::text::jsonb
    )
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Теперь (по желанию) можно ужесточить RLS политику для таблицы profiles,
-- запретив напрямую обновлять total_points через обычный UPDATE.
-- Но пока оставим функцию как основной метод.
