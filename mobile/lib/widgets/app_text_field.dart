import 'package:flutter/material.dart'; 

class AppTextField extends StatelessWidget { 
  final TextEditingController controller; 
  final String label; 
  final bool obscureText; 
  final TextInputType keyboardType; 
  final Widget? suffixIcon;
  final Color? textColor;
  final Color? labelColor;

  const AppTextField({
    super.key,
    required this.controller,
    required this.label,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.suffixIcon,
    this.textColor,
    this.labelColor,
  }); 
  
  @override Widget build(BuildContext context) { 
    final scheme = Theme.of(context).colorScheme; 
    return TextField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: TextStyle(
        color: textColor ?? scheme.onSurface,
      ), decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(
          color: labelColor ?? scheme.onSurface.withOpacity(0.7),
        ),
        border: const OutlineInputBorder(),
        suffixIcon: suffixIcon,
      ),
    );
  }
} 

class AppText extends StatelessWidget {
  final String text;
  final TextStyle? style;

  const AppText(
    this.text, {
    super.key,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: style ?? Theme.of(context).textTheme.bodyMedium,
    );
  }
}
