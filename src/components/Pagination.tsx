import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface PaginationProps {
  page: number;
  count: number;
  pageSize?: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  count,
  pageSize = 12,
  onPageChange,
}) => {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const displayCount = 5;

    let startPage = Math.max(1, page - Math.floor(displayCount / 2));
    const endPage = Math.min(totalPages, startPage + displayCount - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - displayCount + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const renderPageButton = (pageNum: number) => {
    const isActive = pageNum === page;
    return (
      <TouchableOpacity
        key={pageNum}
        style={[styles.pageButton, isActive && styles.pageButtonActive]}
        onPress={() => onPageChange(pageNum)}
      >
        <Text style={[styles.pageText, isActive && styles.pageTextActive]}>
          {pageNum}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEllipsis = (key: string) => (
    <View key={key} style={styles.ellipsisContainer}>
      <Text style={styles.ellipsisText}>...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[styles.navButton, page <= 1 && styles.disabledButton]}
        disabled={page <= 1}
        onPress={() => onPageChange(page - 1)}
      >
        <Ionicons name="chevron-back" size={16} color={page <= 1 ? colors.textSecondary : colors.textPrimary} />
        <Text style={[styles.navText, page <= 1 && styles.disabledText]}>
          Ankstesnis
        </Text>
      </TouchableOpacity>

      {/* Pages Container */}
      <View style={styles.pagesContainer}>
        {pageNumbers[0] > 1 && (
          <>
            {renderPageButton(1)}
            {pageNumbers[0] > 2 && renderEllipsis('start-ellipsis')}
          </>
        )}

        {pageNumbers.map((pageNum) => renderPageButton(pageNum))}

        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && renderEllipsis('end-ellipsis')}
        {pageNumbers[pageNumbers.length - 1] < totalPages && renderPageButton(totalPages)}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.navButton, page >= totalPages && styles.disabledButton]}
        disabled={page >= totalPages}
        onPress={() => onPageChange(page + 1)}
      >
        <Text style={[styles.navText, page >= totalPages && styles.disabledText]}>
          Kitas
        </Text>
        <Ionicons name="chevron-forward" size={16} color={page >= totalPages ? colors.textSecondary : colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  pagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pageButtonActive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pageText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  pageTextActive: {
    fontWeight: '700',
  },
  ellipsisContainer: {
    width: 24,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipsisText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default Pagination;
