;; https://godbolt.org/z/66bETjcqj

define dso_local void @bench_mul256(ptr noundef writeonly captures(none) %0, i64 noundef %1) local_unnamed_addr #0 {
  %3 = icmp eq i64 %1, 0
  br i1 %3, label %4, label %6

4:
  %5 = phi i256 [ 1, %2 ], [ %10, %6 ]
  store i256 %5, ptr %0, align 8
  ret void

6:
  %7 = phi i64 [ %11, %6 ], [ 0, %2 ]
  %8 = phi i256 [ %10, %6 ], [ 1, %2 ]
  %9 = zext i64 %7 to i256
  %10 = mul i256 %8, %9
  %11 = add nuw i64 %7, 1
  %12 = icmp eq i64 %11, %1
  br i1 %12, label %4, label %6
}

define dso_local void @bench_add256(ptr noundef writeonly captures(none) %0, i64 noundef %1) local_unnamed_addr #0 {
  %3 = icmp eq i64 %1, 0
  br i1 %3, label %4, label %6

4:
  %5 = phi i256 [ 0, %2 ], [ %11, %6 ]
  store i256 %5, ptr %0, align 8
  ret void

6:
  %7 = phi i64 [ %12, %6 ], [ 0, %2 ]
  %8 = phi i256 [ %11, %6 ], [ 0, %2 ]
  %9 = add i64 %7, 10
  %10 = zext i64 %9 to i256
  %11 = add i256 %8, %10
  %12 = add nuw i64 %7, 1
  %13 = icmp eq i64 %12, %1
  br i1 %13, label %4, label %6
}
